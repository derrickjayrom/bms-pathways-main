import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  X,
  Shield,
  Loader2,
  AlertCircle,
  FileText,
  RotateCw,
  Expand,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getSecureDownloadUrl, type SavedSubscriptionSession } from "@/lib/subscriptions";
import type { PDFDocumentProxy, RenderTask } from "pdfjs-dist";

interface ProtectedPdfViewerProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
  filename: string;
  title: string;
  targetPathwayId?: string | undefined;
  activeSession?: SavedSubscriptionSession | null | undefined;
}

export function ProtectedPdfViewer({
  isOpen,
  onClose,
  fileUrl,
  filename,
  title,
  targetPathwayId,
  activeSession,
}: ProtectedPdfViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.15);
  const [rotation, setRotation] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingStatus, setLoadingStatus] = useState<string>("Initializing secure viewer...");
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [pageInput, setPageInput] = useState<string>("1");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pdfDocRef = useRef<PDFDocumentProxy | null>(null);
  const renderTaskRef = useRef<RenderTask | null>(null);

  // User identity details for dynamic anti-piracy watermarking
  const subscriberEmail =
    activeSession?.email ||
    (typeof window !== "undefined" ? localStorage.getItem("bms_user_email") : null) ||
    "Verified Member";
  const subscriberName = activeSession?.full_name || "BMS Pathways";
  const watermarkDate = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // Handle Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Block printing, saving, and developer inspection keys
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent Ctrl+S / Cmd+S (Save page/file)
      if ((e.ctrlKey || e.metaKey) && (e.key === "s" || e.key === "S")) {
        e.preventDefault();
        toast.warning("Protected Document", {
          description: "Direct file download is restricted. This document is view-only.",
          duration: 4000,
        });
        return;
      }

      // Prevent Ctrl+P / Cmd+P (Print to PDF)
      if ((e.ctrlKey || e.metaKey) && (e.key === "p" || e.key === "P")) {
        e.preventDefault();
        toast.warning("Print Restricted", {
          description: "Printing has been disabled to protect BMS proprietary materials.",
          duration: 4000,
        });
        return;
      }

      // Prevent Ctrl+C / Cmd+C (Copy)
      if ((e.ctrlKey || e.metaKey) && (e.key === "c" || e.key === "C")) {
        e.preventDefault();
        return;
      }

      // Navigation shortcuts
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault();
        setCurrentPage((prev) => Math.min(prev + 1, numPages || prev));
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        setCurrentPage((prev) => Math.max(prev - 1, 1));
      } else if (e.key === "Escape" && !document.fullscreenElement) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, numPages, onClose]);

  // Load PDF Document safely into memory via PDF.js
  useEffect(() => {
    if (!isOpen || !fileUrl) return;

    let isMounted = true;
    setLoading(true);
    setError(null);
    setCurrentPage(1);
    setPageInput("1");
    setLoadingStatus("Verifying access & loading guide...");

    const loadPdf = async () => {
      try {
        // 1. Obtain authorized temporary Signed URL
        const secureRes = await getSecureDownloadUrl(fileUrl, filename, targetPathwayId);
        if (!secureRes.success || !secureRes.downloadUrl) {
          throw new Error(secureRes.error || "Unable to retrieve authorized document stream.");
        }

        if (!isMounted) return;
        setLoadingStatus("Fetching document data...");

        // 2. Fetch the PDF binary as an ArrayBuffer in memory
        const response = await fetch(secureRes.downloadUrl, { mode: "cors" });
        if (!response.ok) {
          throw new Error(`Failed to load document (HTTP ${response.status}).`);
        }
        const arrayBuffer = await response.arrayBuffer();

        if (!isMounted) return;
        setLoadingStatus("Rendering high-definition slides...");

        // 3. Dynamically import PDF.js on client side to preserve SSR compatibility
        const pdfjs = await import("pdfjs-dist");

        // Set worker source (cdnjs fallback matching pdfjs version)
        if (!pdfjs.GlobalWorkerOptions.workerSrc) {
          pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;
        }

        const loadingTask = pdfjs.getDocument({
          data: arrayBuffer,
          cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
          cMapPacked: true,
        });

        const pdf = await loadingTask.promise;
        if (!isMounted) return;

        pdfDocRef.current = pdf;
        setNumPages(pdf.numPages);
        setLoading(false);
      } catch (err: unknown) {
        if (!isMounted) return;
        const msg =
          err instanceof Error
            ? err.message
            : "Failed to load protected document. Please try again.";
        console.error("Secure PDF Viewer Error:", err);
        setError(msg);
        setLoading(false);
      }
    };

    loadPdf();

    return () => {
      isMounted = false;
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch (_cancelErr) {
          // Ignore cancellation errors when component unmounts
        }
      }
    };
  }, [isOpen, fileUrl, filename, targetPathwayId]);

  // Render current page onto Canvas
  const renderCurrentPage = useCallback(async () => {
    if (!pdfDocRef.current || !canvasRef.current || currentPage < 1) return;

    try {
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch (_cancelErr) {
          // Ignore task cancellation on fast slide changes
        }
      }

      const page = await pdfDocRef.current.getPage(currentPage);
      const canvas = canvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext("2d", { alpha: false });
      if (!context) return;

      // Calculate crisp High-DPI viewport
      const pixelRatio = Math.max(window.devicePixelRatio || 1, 1.5);
      const viewport = page.getViewport({ scale, rotation });

      canvas.width = Math.floor(viewport.width * pixelRatio);
      canvas.height = Math.floor(viewport.height * pixelRatio);
      canvas.style.width = `${Math.floor(viewport.width)}px`;
      canvas.style.height = `${Math.floor(viewport.height)}px`;

      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      const renderContext = {
        canvasContext: context,
        viewport,
      };

      const renderTask = page.render(renderContext);
      renderTaskRef.current = renderTask;
      await renderTask.promise;
    } catch (err: unknown) {
      const isCancelled =
        typeof err === "object" &&
        err !== null &&
        "name" in err &&
        (err as { name: string }).name === "RenderingCancelledException";
      if (!isCancelled) {
        console.error("Canvas render error:", err);
      }
    }
  }, [currentPage, scale, rotation]);

  useEffect(() => {
    if (!loading && pdfDocRef.current) {
      renderCurrentPage();
      setPageInput(currentPage.toString());
    }
  }, [loading, currentPage, scale, rotation, renderCurrentPage]);

  // Lock body scroll while modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, numPages));
  };

  const handlePageJump = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseInt(pageInput, 10);
    if (!isNaN(p) && p >= 1 && p <= numPages) {
      setCurrentPage(p);
    } else {
      setPageInput(currentPage.toString());
    }
  };

  const handleFitWidth = () => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.clientWidth - 64;
    if (containerWidth > 320) {
      // 800px standard slide width estimate
      const newScale = Math.min(Math.max(containerWidth / 960, 0.6), 2.0);
      setScale(parseFloat(newScale.toFixed(2)));
    }
  };

  return (
    <div
      ref={containerRef}
      onContextMenu={(e) => {
        e.preventDefault();
        toast.info("Protected View-Only Document", {
          description: "Copying and right-click saving are disabled for this material.",
          duration: 3000,
        });
      }}
      className="fixed inset-0 z-50 flex flex-col bg-stone-950/98 backdrop-blur-md select-none text-stone-100 animate-in fade-in-0 duration-200"
    >
      {/* TOP CONTROLS TOOLBAR */}
      <header className="flex-none flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-stone-800 bg-stone-900/90 shadow-md">
        {/* Left: Document Info & Security Badge */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-semibold shrink-0">
            <Shield className="size-3.5" />
            <span className="hidden sm:inline">Protected</span>
            <span>View Only</span>
          </div>

          <div className="truncate">
            <h2 className="text-sm font-bold text-white truncate max-w-xs sm:max-w-md md:max-w-lg">
              {title}
            </h2>
            <p className="text-[11px] text-stone-400 truncate hidden md:block">
              Licensed to <span className="text-emerald-400 font-medium">{subscriberEmail}</span> ·
              Confidential BMS Material
            </p>
          </div>
        </div>

        {/* Center: Page Navigation */}
        <div className="flex items-center gap-1.5 bg-stone-950/80 px-2 py-1 rounded-lg border border-stone-800">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrevPage}
            disabled={currentPage <= 1 || loading}
            className="h-8 w-8 p-0 text-stone-300 hover:text-white hover:bg-stone-800 disabled:opacity-30 cursor-pointer"
            title="Previous Page (←)"
          >
            <ChevronLeft className="size-4" />
          </Button>

          <form
            onSubmit={handlePageJump}
            className="flex items-center text-xs text-stone-400 gap-1"
          >
            <span>Page</span>
            <input
              type="text"
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              onBlur={() => setPageInput(currentPage.toString())}
              className="w-10 h-7 text-center rounded bg-stone-900 border border-stone-700 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
              disabled={loading}
            />
            <span>of {numPages || 1}</span>
          </form>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage >= numPages || loading}
            className="h-8 w-8 p-0 text-stone-300 hover:text-white hover:bg-stone-800 disabled:opacity-30 cursor-pointer"
            title="Next Page (→)"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>

        {/* Right: Zoom & Close Controls */}
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setScale((s) => Math.max(s - 0.15, 0.5))}
            disabled={scale <= 0.5 || loading}
            className="h-8 w-8 p-0 text-stone-300 hover:text-white hover:bg-stone-800 cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="size-4" />
          </Button>

          <span className="text-xs font-mono text-stone-400 w-12 text-center hidden sm:inline">
            {Math.round(scale * 100)}%
          </span>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setScale((s) => Math.min(s + 0.15, 2.5))}
            disabled={scale >= 2.5 || loading}
            className="h-8 w-8 p-0 text-stone-300 hover:text-white hover:bg-stone-800 cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="size-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleFitWidth}
            disabled={loading}
            className="h-8 px-2 text-xs text-stone-300 hover:text-white hover:bg-stone-800 hidden sm:flex cursor-pointer"
            title="Fit to Width"
          >
            <Expand className="size-3.5 mr-1" />
            Fit
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setRotation((r) => (r + 90) % 360)}
            disabled={loading}
            className="h-8 w-8 p-0 text-stone-300 hover:text-white hover:bg-stone-800 hidden sm:flex cursor-pointer"
            title="Rotate"
          >
            <RotateCw className="size-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className="h-8 w-8 p-0 text-stone-300 hover:text-white hover:bg-stone-800 cursor-pointer"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
          </Button>

          <div className="h-4 w-px bg-stone-800 mx-1" />

          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 text-stone-400 hover:text-white hover:bg-red-950/50 hover:text-red-400 rounded-lg cursor-pointer transition-colors"
            title="Close Viewer (Esc)"
          >
            <X className="size-5" />
          </Button>
        </div>
      </header>

      {/* VIEWER MAIN CANVAS AREA */}
      <div className="flex-1 overflow-auto p-4 sm:p-8 flex items-center justify-center relative bg-radial from-stone-900 to-stone-950">
        {loading && (
          <div className="flex flex-col items-center gap-3 text-stone-400 py-16">
            <Loader2 className="size-8 animate-spin text-emerald-500" />
            <p className="text-sm font-medium">{loadingStatus}</p>
            <p className="text-xs text-stone-500">Preparing protected view-only stream...</p>
          </div>
        )}

        {error && (
          <div className="max-w-md p-6 rounded-2xl bg-stone-900 border border-red-500/30 text-center">
            <AlertCircle className="size-10 text-red-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-2">Unable to Open Protected Guide</h3>
            <p className="text-xs text-stone-400 mb-5 leading-relaxed">{error}</p>
            <Button
              onClick={onClose}
              className="bg-stone-800 hover:bg-stone-700 text-white font-medium text-xs rounded-xl"
            >
              Close Reader
            </Button>
          </div>
        )}

        {/* PROTECTED CANVAS CONTAINER WITH DYNAMIC ANTI-THEFT WATERMARK OVERLAY */}
        <div
          className={`relative shadow-2xl rounded-sm transition-opacity duration-300 ${
            loading || error ? "hidden" : "block"
          }`}
          style={{ maxWidth: "100%" }}
        >
          {/* Canvas Rendering Target */}
          <canvas ref={canvasRef} className="block max-w-full bg-white rounded-xs shadow-2xl" />

          {/* DYNAMIC WATERMARK OVERLAY (Prevents screenshots / redistribution) */}
          <div
            className="absolute inset-0 pointer-events-none select-none overflow-hidden flex flex-col justify-around p-8 z-10"
            style={{ mixBlendMode: "multiply" }}
            aria-hidden="true"
          >
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="flex justify-around items-center opacity-[0.14] text-stone-900 font-bold uppercase tracking-widest text-[11px] sm:text-xs transform -rotate-25 space-x-12"
              >
                <span>BMS PATHWAYS · VIEW ONLY</span>
                <span className="hidden sm:inline">
                  {subscriberEmail} · {watermarkDate}
                </span>
                <span>CONFIDENTIAL DO NOT COPY</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER BAR: SECURITY NOTICE & TIPS */}
      <footer className="flex-none flex items-center justify-between px-4 py-2 bg-stone-950 border-t border-stone-800/80 text-[11px] text-stone-500">
        <div className="flex items-center gap-2">
          <span className="inline-block size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>DRM Protected · Right-click and downloading disabled</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-stone-400">
          <span>Use ← → keys to flip slides</span>
          <span>·</span>
          <span>Esc to exit</span>
        </div>
      </footer>
    </div>
  );
}
