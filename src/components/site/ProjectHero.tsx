import { ExternalLink, Globe, Layers, Compass, ArrowRight } from "lucide-react";

type Props = {
  project: {
    title: string;
    summary?: string;
    links?: { live?: string; prototype?: string; figma?: string };
  };
};

const linkItems = [
  { key: "live", label: "Live preview", icon: Globe },
  { key: "prototype", label: "Prototype", icon: Layers },
  { key: "figma", label: "Figma file", icon: Compass },
] as const;

const ProjectHero = ({ project }: Props) => {
  const { title, summary, links } = project;
  const availableLinks = linkItems.filter(({ key }) => links?.[key]);
  const primaryLiveLink = links?.live || links?.prototype;
  console.log(project)

  return (
    <section className="mx-auto max-w-6xl px-6 py-16 lg:py-20">
      <div className="space-y-6">
        {/* Title & Summary Stack */}
        <div className="space-y-6 max-w-4xl">
          <h1 className="text-4xl sm:text-5xl lg:text-5xl font-bold tracking-tight text-zinc-900 leading-[1.08]">
            {title}
          </h1>

          {summary && (
            <p className="text-base sm:text-lg text-zinc-600 leading-relaxed font-normal">
              {summary}
            </p>
          )}
        </div>

        {/* Action Toolbar: Primary CTA + Resource Links */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          {/* Prominent Primary Call-to-Action Button */}
          {primaryLiveLink && (
            <a
              href={primaryLiveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-orange-600 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-orange-600/25 hover:bg-orange-500 hover:shadow-orange-600/40 hover:-translate-y-0.5 transition-all duration-200"
            >
              <span>Explore Live Project</span>
              <ArrowRight size={15} />
            </a>
          )}

          {/* Individual Resource Links */}
          {availableLinks.length > 0 && (
            <div className="flex flex-wrap items-center gap-3">
              {availableLinks.map(({ key, label, icon: Icon }) => (
                <a
                  key={key}
                  href={links![key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-white border border-zinc-200/90 text-zinc-700 text-xs sm:text-sm font-medium hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50/50 hover:-translate-y-0.5 transition-all duration-200 shadow-sm"
                >
                  <Icon
                    size={15}
                    className="text-zinc-400 group-hover:text-orange-600 transition-colors"
                  />
                  <span>{label}</span>
                  <ExternalLink size={13} className="opacity-50 group-hover:opacity-100 transition-opacity ml-0.5" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProjectHero;