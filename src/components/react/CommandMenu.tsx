import { Command, ExternalLink, Printer, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface CommandLink {
  title: string;
  url: string;
}

interface Props {
  links: CommandLink[];
}

export default function CommandMenu({ links }: Props) {
  const [open, setOpen] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setIsMac(window.navigator.userAgent.includes("Mac"));
  }, []);

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "j" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((current) => !current);
      }

      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const filteredLinks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return links;

    return links.filter((link) => link.title.toLowerCase().includes(normalizedQuery));
  }, [links, query]);

  const runPrint = () => {
    setOpen(false);
    window.print();
  };

  const openLink = (url: string) => {
    setOpen(false);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <p className="fixed bottom-0 left-0 right-0 hidden border-t bg-white p-1 text-center text-sm text-gray-500 xl:block print:hidden">
        Press{" "}
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-gray-100 px-1.5 font-mono text-[10px] font-medium text-gray-500 opacity-100">
          <span className="text-xs">{isMac ? "⌘" : "Ctrl"}</span>+J
        </kbd>{" "}
        to open the command menu
      </p>

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="fixed bottom-4 right-4 flex size-12 items-center justify-center rounded-full border bg-white shadow-2xl transition hover:bg-gray-100 xl:hidden print:hidden"
        aria-label="Open command menu"
      >
        <Command className="size-6" aria-hidden="true" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 pt-[12vh] print:hidden" role="presentation" onMouseDown={() => setOpen(false)}>
          <div
            className="w-full max-w-lg overflow-hidden rounded-lg border bg-white shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Command menu"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-center border-b px-3">
              <Command className="mr-2 size-4 shrink-0 opacity-50" aria-hidden="true" />
              <input
                className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-gray-500"
                placeholder="Type a command or search..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                autoFocus
              />
              <button type="button" onClick={() => setOpen(false)} className="rounded p-1 text-gray-500 hover:bg-gray-100" aria-label="Close command menu">
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>

            <div className="max-h-[320px] overflow-y-auto p-2">
              <div className="px-2 py-1.5 text-xs font-medium text-gray-500">Actions</div>
              <button type="button" onClick={runPrint} className="flex w-full items-center gap-2 rounded-sm px-2 py-2 text-left text-sm hover:bg-gray-100">
                <Printer className="size-4" aria-hidden="true" />
                <span>Print</span>
              </button>

              <div className="mt-2 border-t pt-2">
                <div className="px-2 py-1.5 text-xs font-medium text-gray-500">Links</div>
                {filteredLinks.length === 0 ? (
                  <p className="px-2 py-6 text-center text-sm text-gray-500">No results found.</p>
                ) : (
                  filteredLinks.map((link) => (
                    <button key={link.url} type="button" onClick={() => openLink(link.url)} className="flex w-full items-center gap-2 rounded-sm px-2 py-2 text-left text-sm hover:bg-gray-100">
                      <ExternalLink className="size-4" aria-hidden="true" />
                      <span>{link.title}</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
