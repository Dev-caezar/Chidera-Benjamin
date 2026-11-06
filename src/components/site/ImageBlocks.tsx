import Image from "next/image";
import type { ImageBlock } from "@/types/project";

export default function ImageBlocks({
    images,
    columns = 1,
}: {
    images: ImageBlock[];
    columns?: 1 | 2;
}) {
    if (!images || images.length === 0) return null;

    return (
        <div className={columns === 2 ? "grid gap-6 md:grid-cols-2" : "space-y-8"}>
            {images.map((img, i) => (
                <figure key={`${img.url}-${i}`} className="group relative flex flex-col items-center">
                    <div className="relative w-full max-h-130 flex items-center justify-center overflow-hidden rounded-2xl border border-zinc-200/80 bg-zinc-950/5 p-3 sm:p-5 shadow-xs transition-all duration-300 group-hover:border-[#F44A00]/40 group-hover:shadow-md">
                        <Image
                            src={img.url}
                            alt={img.alt || "Case study design mockup"}
                            width={1200}
                            height={800}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 1000px"
                            className="w-auto h-auto max-h-120 object-contain transition-transform duration-500 ease-out group-hover:scale-[1.01]"
                        />
                    </div>
                    {img.caption && (
                        <figcaption className="mt-3 flex items-center justify-center gap-2 text-center text-xs sm:text-sm font-medium text-zinc-500">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#F44A00]" />
                            <span>{img.caption}</span>
                        </figcaption>
                    )}
                </figure>
            ))}
        </div>
    );
}