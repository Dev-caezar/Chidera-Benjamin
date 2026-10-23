import { Download } from "lucide-react";

export function DownloadCVButton() {
    return (
        <a
            href="/chidera-benjamin-resume.pdf"
            download="Chidera_Benjamin_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5 rounded-full bg-[#F44A00] px-7 py-3.5 text-sm font-bold text-white shadow-md transition-all duration-200 hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-600/20 active:scale-95"
        >
            <Download size={16} className="transition-transform duration-200 group-hover:-translate-y-0.5" />
            <span>Download CV</span>
        </a>
    );
}