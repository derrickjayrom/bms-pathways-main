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
}: ProtectedPdfViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [isAutoFit, setIsAutoFit] = useState<boolean>(true);
  const [rotation, setRotation] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingStatus, setLoadingStatus] = useState<string>("Initializing secure viewer...");
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [pageInput, setPageInput] = useState<string>("1");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewerAreaRef = useRef<HTMLDivElement | null>(null);
  const pdfDocRef = useRef<PDFDocumentProxy | null>(null);
  const renderTaskRef = useRef<RenderTask | null>(null);
  const pageDimensionsRef = useRef<{ width: number; height: number } | null>(null);

  // Touch gesture tracking for mobile swipe and double-tap
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const lastTapRef = useRef<number>(0);

  // Calculate the optimal scale to fit the presentation slide inside the current viewer viewport
  const calculateOptimalFitScale = useCallback(
    (pageWidth: number, pageHeight: number) => {
      if (!viewerAreaRef.current) return 1.0;
      const isMobile = window.innerWidth < 640;
      // Generous readable bounds with minimal padding on mobile screens
      const padX = isMobile ? 16 : 48;
      const padY = isMobile ? 20 : 48;
      const availW = Math.max(viewerAreaRef.current.clientWidth - padX, 260);
      const availH = Math.max(viewerAreaRef.current.clientHeight - padY, 180);

      const scaleW = availW / pageWidth;
      const scaleH = availH / pageHeight;

      // Fit both dimensions without cut-off
      const fit = Math.min(scaleW, scaleH);
      return Math.max(Math.min(parseFloat(fit.toFixed(3)), 3.0), 0.25);
    },
    [],
  );

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
          duration: 3500,
        });
        return;
      }

      // Prevent Ctrl+P / Cmd+P (Print to PDF)
      if ((e.ctrlKey || e.metaKey) && (e.key === "p" || e.key === "P")) {
        e.preventDefault();
        toast.warning("Print Restricted", {
          description: "Printing has been disabled to protect BMS proprietary materials.",
          duration: 3500,
        });
        return;
      }

      // Prevent Ctrl+C / Cmd+C (Copy)
      if ((e.ctrlKey || e.metaKey) && (e.key === "c" || e.key === "C")) {
        e.preventDefault();
        return;
      }

      // Navigation shortcuts
      if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        setCurrentPage((prev) => Math.min(prev + 1, numPages || prev));
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        setCurrentPage((prev) => Math.max(prev - 1, 1));
      } else if (e.key === "Home") {
        e.preventDefault();
        setCurrentPage(1);
      } else if (e.key === "End") {
        e.preventDefault();
        setCurrentPage(numPages || 1);
      } else if (e.key === "Escape" && !document.fullscreenElement) {
        onClose();
      } else if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        setIsAutoFit(false);
        setScale((s) => Math.min(parseFloat((s + 0.15).toFixed(2)), 3.0));
      } else if (e.key === "-") {
        e.preventDefault();
        setIsAutoFit(false);
        setScale((s) => Math.max(parseFloat((s - 0.15).toFixed(2)), 0.3));
      } else if (e.key === "0" || e.key.toLowerCase() === "f") {
        e.preventDefault();
        handleFitWidth();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, numPages, onClose]);

  // Load PDF Document into memory via PDF.js
  useEffect(() => {
    if (!isOpen || !fileUrl) return;

    let isMounted = true;
    setLoading(true);
    setError(null);
    setCurrentPage(1);
    setPageInput("1");
    setIsAutoFit(true);
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

        // 3. Dynamically import PDF.js on client side
        const pdfjs = await import("pdfjs-dist");

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

  // Recalculate fit scale on resize or orientation change if in auto-fit mode
  useEffect(() => {
    const handleResize = () => {
      if (isAutoFit && pageDimensionsRef.current) {
        const newFit = calculateOptimalFitScale(
          pageDimensionsRef.current.width,
          pageDimensionsRef.current.height,
        );
        setScale(newFit);
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, [isAutoFit, calculateOptimalFitScale]);

  // Render current page onto Canvas
  const renderCurrentPage = useCallback(async () => {
    if (!pdfDocRef.current || !canvasRef.current || currentPage < 1) return;

    try {
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch (_cancelErr) {
          // Ignore task cancellation on rapid page flips
        }
      }

      const page = await pdfDocRef.current.getPage(currentPage);
      const canvas = canvasRef.current;
      if (!canvas) return;

      const unscaledViewport = page.getViewport({ scale: 1, rotation });
      pageDimensionsRef.current = {
        width: unscaledViewport.width,
        height: unscaledViewport.height,
      };

      // Determine active scale (auto-fit or custom)
      let currentScale = scale;
      if (isAutoFit) {
        const fit = calculateOptimalFitScale(unscaledViewport.width, unscaledViewport.height);
        if (Math.abs(fit - scale) > 0.01) {
          setScale(fit);
          return;
        }
        currentScale = fit;
      }

      const context = canvas.getContext("2d", { alpha: false });
      if (!context) return;

      // Crisp High-DPI viewport with sharp backing store
      const pixelRatio = Math.min(Math.max(window.devicePixelRatio || 1, 1), 2.5);
      const viewport = page.getViewport({ scale: currentScale, rotation });

      canvas.width = Math.floor(viewport.width * pixelRatio);
      canvas.height = Math.floor(viewport.height * pixelRatio);
      canvas.style.width = `${Math.floor(viewport.width)}px`;
      canvas.style.height = `${Math.floor(viewport.height)}px`;
      canvas.style.aspectRatio = `${viewport.width} / ${viewport.height}`;

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
  }, [currentPage, scale, rotation, isAutoFit, calculateOptimalFitScale]);

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
    setIsAutoFit(true);
    if (pageDimensionsRef.current) {
      const fit = calculateOptimalFitScale(
        pageDimensionsRef.current.width,
        pageDimensionsRef.current.height,
      );
      setScale(fit);
    }
  };

  const handleZoomIn = () => {
    setIsAutoFit(false);
    setScale((s) => Math.min(parseFloat((s + 0.15).toFixed(2)), 3.0));
  };

  const handleZoomOut = () => {
    setIsAutoFit(false);
    setScale((s) => Math.max(parseFloat((s - 0.15).toFixed(2)), 0.3));
  };

  // Touch Swipe & Double Tap Gestures for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    const firstTouch = e.touches[0];
    if (firstTouch && e.touches.length === 1) {
      touchStartRef.current = {
        x: firstTouch.clientX,
        y: firstTouch.clientY,
        time: Date.now(),
      };
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touch = e.changedTouches[0];
    if (!touchStartRef.current || !touch || e.changedTouches.length !== 1) return;

    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const elapsed = Date.now() - touchStartRef.current.time;

    // Swipe detected if horizontal gesture > 45px and mostly horizontal within 600ms
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.3 && elapsed < 600) {
      if (deltaX < 0) {
        handleNextPage();
      } else {
        handlePrevPage();
      }
    } else if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10 && elapsed < 300) {
      // Check for double-tap zoom
      const now = Date.now();
      if (now - lastTapRef.current < 350) {
        if (isAutoFit) {
          setIsAutoFit(false);
          setScale((s) => Math.min(parseFloat((s * 1.8).toFixed(2)), 3.0));
        } else {
          handleFitWidth();
        }
        lastTapRef.current = 0;
      } else {
        lastTapRef.current = now;
      }
    }

    touchStartRef.current = null;
  };

  return (
    <div
      ref={containerRef}
      onContextMenu={(e) => {
        e.preventDefault();
        toast.info("Protected View-Only Document", {
          description: "Right-click saving is disabled for this material.",
          duration: 2500,
        });
      }}
      className="fixed inset-0 z-50 flex flex-col bg-stone-950 select-none text-stone-100 animate-in fade-in-0 duration-200"
    >
      {/* TOP CONTROLS TOOLBAR (RESPONSIVE SINGLE ROW) */}
      <header className="flex-none h-14 flex items-center justify-between px-3 sm:px-5 border-b border-stone-800 bg-stone-900/95 shadow-md backdrop-blur-md z-20">
        {/* Left: Close Button & Document Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-9 w-9 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg shrink-0 cursor-pointer"
            title="Close Viewer (Esc)"
          >
            <X className="size-5" />
          </Button>

          <div className="h-4 w-px bg-stone-800 shrink-0" />

          <div className="flex items-center gap-2 min-w-0">
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold shrink-0 uppercase tracking-wider">
              <Shield className="size-3" /> Guide
            </span>
            <div className="truncate">
              <h2 className="text-xs sm:text-sm font-bold text-white truncate max-w-[150px] xs:max-w-[220px] sm:max-w-xs md:max-w-md lg:max-w-lg">
                {title}
              </h2>
              <p className="text-[10px] text-stone-400 truncate hidden md:block">
                Official BMS Pathways Guide · High-Definition Presentation
              </p>
            </div>
          </div>
        </div>

        {/* Center: Desktop Page Navigation */}
        <div className="hidden md:flex items-center gap-1.5 bg-stone-950/90 px-2 py-1 rounded-lg border border-stone-800 shadow-inner">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrevPage}
            disabled={currentPage <= 1 || loading}
            className="h-7 w-7 p-0 text-stone-300 hover:text-white hover:bg-stone-800 disabled:opacity-30 cursor-pointer"
            title="Previous Page (←)"
          >
            <ChevronLeft className="size-4" />
          </Button>

          <form
            onSubmit={handlePageJump}
            className="flex items-center text-xs text-stone-400 gap-1"
          >
            <span className="text-[11px] text-stone-500">Page</span>
            <input
              type="text"
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              onBlur={() => setPageInput(currentPage.toString())}
              className="w-10 h-6 text-center rounded bg-stone-900 border border-stone-700 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
              disabled={loading}
            />
            <span className="text-[11px] text-stone-500">of {numPages || 1}</span>
          </form>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage >= numPages || loading}
            className="h-7 w-7 p-0 text-stone-300 hover:text-white hover:bg-stone-800 disabled:opacity-30 cursor-pointer"
            title="Next Page (→)"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>

        {/* Right: Controls & Page Badge (Mobile/Desktop) */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Mobile slide counter pill */}
          <div className="md:hidden flex items-center gap-1 text-[11px] font-mono text-stone-300 bg-stone-950 px-2.5 py-1 rounded-md border border-stone-800">
            <span className="text-emerald-400 font-bold">{currentPage}</span>
            <span className="text-stone-500">/</span>
            <span>{numPages || 1}</span>
          </div>

          {/* Desktop Zoom Out */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomOut}
            disabled={scale <= 0.3 || loading}
            className="hidden sm:flex h-8 w-8 p-0 text-stone-300 hover:text-white hover:bg-stone-800 cursor-pointer"
            title="Zoom Out (-)"
          >
            <ZoomOut className="size-4" />
          </Button>

          {/* Desktop Scale Indicator */}
          <span className="text-xs font-mono text-stone-400 w-12 text-center hidden lg:inline">
            {Math.round(scale * 100)}%
          </span>

          {/* Desktop Zoom In */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomIn}
            disabled={scale >= 3.0 || loading}
            className="hidden sm:flex h-8 w-8 p-0 text-stone-300 hover:text-white hover:bg-stone-800 cursor-pointer"
            title="Zoom In (+)"
          >
            <ZoomIn className="size-4" />
          </Button>

          {/* Fit to Screen Button (Accessible on both Mobile & Desktop) */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFitWidth}
            disabled={loading}
            className={`h-8 px-2.5 text-xs rounded-lg cursor-pointer transition-colors ${
              isAutoFit
                ? "bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/80"
                : "text-stone-300 hover:text-white hover:bg-stone-800"
            }`}
            title="Auto-Fit to Screen (F)"
          >
            <Expand className="size-3.5 mr-1" />
            <span className="text-[11px]">Fit</span>
          </Button>

          {/* Rotate (Desktop) */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setRotation((r) => (r + 90) % 360)}
            disabled={loading}
            className="h-8 w-8 p-0 text-stone-300 hover:text-white hover:bg-stone-800 hidden md:flex cursor-pointer"
            title="Rotate 90°"
          >
            <RotateCw className="size-3.5" />
          </Button>

          {/* Fullscreen Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className="h-8 w-8 p-0 text-stone-300 hover:text-white hover:bg-stone-800 cursor-pointer"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
          </Button>
        </div>
      </header>

      {/* VIEWER MAIN CANVAS AREA WITH AUTO-FIT & TOUCH GESTURES */}
      <div
        ref={viewerAreaRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="flex-1 overflow-auto relative bg-gradient-to-b from-stone-950 via-stone-900/90 to-stone-950 p-2 sm:p-6 flex flex-col items-center justify-start sm:justify-center min-h-0 select-none touch-pan-x touch-pan-y"
      >
        {loading && (
          <div className="m-auto flex flex-col items-center gap-3 text-stone-400 py-16">
            <Loader2 className="size-8 animate-spin text-emerald-500" />
            <p className="text-sm font-medium">{loadingStatus}</p>
            <p className="text-xs text-stone-500">Preparing high-definition slide deck...</p>
          </div>
        )}

        {error && (
          <div className="m-auto max-w-md p-6 rounded-2xl bg-stone-900 border border-red-500/30 text-center shadow-xl">
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

        {/* CLEAN CANVAS CONTAINER (NO WATERMARKS, NO EMAILS, CRISP PRESENTATION) */}
        <div
          className={`m-auto flex flex-col items-center justify-center py-2 shrink-0 ${
            loading || error ? "hidden" : "flex"
          }`}
        >
          <div className="relative shadow-2xl rounded-sm sm:rounded-md overflow-hidden border border-stone-800/80 bg-white">
            <canvas ref={canvasRef} className="block shadow-2xl" />
          </div>
        </div>
      </div>

      {/* MOBILE COMPACT THUMB NAVIGATION BAR */}
      <div className="md:hidden flex-none flex items-center justify-between px-3 py-2 bg-stone-900/95 border-t border-stone-800/90 backdrop-blur-md z-20">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevPage}
          disabled={currentPage <= 1 || loading}
          className="h-8 px-2.5 text-xs bg-stone-950 border-stone-800 text-stone-200 hover:bg-stone-800 hover:text-white disabled:opacity-30 cursor-pointer"
        >
          <ChevronLeft className="size-4 mr-0.5" />
          <span>Prev</span>
        </Button>

        {/* Mobile slide actions & zoom controls */}
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomOut}
            disabled={scale <= 0.3 || loading}
            className="h-8 w-8 text-stone-300 hover:text-white hover:bg-stone-800"
            title="Zoom Out"
          >
            <ZoomOut className="size-4" />
          </Button>

          <span className="text-[11px] font-mono text-stone-400 min-w-10 text-center">
            {Math.round(scale * 100)}%
          </span>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomIn}
            disabled={scale >= 3.0 || loading}
            className="h-8 w-8 text-stone-300 hover:text-white hover:bg-stone-800"
            title="Zoom In"
          >
            <ZoomIn className="size-4" />
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleNextPage}
          disabled={currentPage >= numPages || loading}
          className="h-8 px-2.5 text-xs bg-stone-950 border-stone-800 text-stone-200 hover:bg-stone-800 hover:text-white disabled:opacity-30 cursor-pointer"
        >
          <span>Next</span>
          <ChevronRight className="size-4 ml-0.5" />
        </Button>
      </div>

      {/* DESKTOP FOOTER BAR */}
      <footer className="hidden md:flex flex-none items-center justify-between px-5 py-2.5 bg-stone-950 border-t border-stone-800 text-[11px] text-stone-400">
        <div className="flex items-center gap-2">
          <span className="inline-block size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>BMS Pathways Verified Guide · High-Definition Slide Deck</span>
        </div>
        <div className="flex items-center gap-4 text-stone-400">
          <span>Use ← → keys or swipe to flip slides</span>
          <span>·</span>
          <span>Double-tap or F to auto-fit</span>
          <span>·</span>
          <span>Esc to exit</span>
        </div>
      </footer>
    </div>
  );
}

