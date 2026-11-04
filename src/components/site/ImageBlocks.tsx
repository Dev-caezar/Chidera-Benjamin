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
                <figure key={`${img.url}-${i}`} className="group relative">
                    <div className="relative aspect-16/10 w-full overflow-hidden rounded-3xl border border-zinc-200/90 bg-zinc-50 shadow-xs transition-all duration-300 group-hover:border-[#F44A00]/40 group-hover:shadow-md">
                        <Image
                            src={img.url}
                            alt={img.alt || "Case study image block"}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 1200px"
                            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                        />
                    </div>
                    {img.caption && (
                        <figcaption className="mt-3.5 flex items-center justify-center gap-2 text-center text-xs sm:text-sm font-medium text-zinc-500">
                            <span className="h-1 w-1 rounded-full bg-[#F44A00]" />
                            <span>{img.caption}</span>
                        </figcaption>
                    )}
                </figure>
            ))}
        </div>
    );
}