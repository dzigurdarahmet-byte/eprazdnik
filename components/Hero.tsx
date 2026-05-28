// Top section on home + catalog. Server Component.
// totalPrograms is computed at request time so the «N программ» counter is
// always live, not the moked 86 from the proto.
import { Icon } from "@/components/Icon";

type HeroProps = {
  title: string;
  subtitle?: string;
  totalPrograms: number;
  metric2Label?: string;
  metric2Value?: string;
};

export function Hero({ title, subtitle, totalPrograms, metric2Label, metric2Value }: HeroProps) {
  return (
    <div className="hero-row">
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle ? <div className="page-sub">{subtitle}</div> : null}
      </div>
      <div className="hero-stats" data-testid="hero-stats">
        <Icon n="library" size={14} /> <b>{totalPrograms}</b> программ
        {metric2Label && metric2Value ? (
          <>
            <span className="dot">·</span>
            <Icon n="calendar" size={14} /> <b>{metric2Value}</b> {metric2Label}
          </>
        ) : null}
      </div>
    </div>
  );
}
