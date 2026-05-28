// Thin wrapper over lucide-react. Old proto used a name-dispatch SVG component;
// here we keep that ergonomic but route to tree-shakable lucide icons.
import {
  Zap, Library, Briefcase, Flame, Wallet, Image, Star, Search, Settings, Send,
  Plus, Users, Clock, Baby, RussianRuble, Sparkles, Wand2, Puzzle, Palette,
  ArrowRight, ArrowUpRight, ChevronRight, ChevronDown, Heart, X, Filter, Play,
  Video, Snowflake, Check, Bell, Trophy, BookOpen, Crown, Calendar, Tag,
  ExternalLink, Command, User, Compass, Gift, type LucideIcon,
} from "lucide-react";

export type IconName =
  | "zap" | "library" | "briefcase" | "flame" | "wallet" | "image" | "star"
  | "search" | "settings" | "send" | "plus" | "users" | "clock" | "baby"
  | "ruble" | "sparkles" | "wand" | "puzzle" | "palette" | "arrow-right"
  | "arrow-up-right" | "chevron-right" | "chevron-down" | "heart" | "x"
  | "filter" | "play" | "video" | "snowflake" | "check" | "bell" | "trophy"
  | "book" | "crown" | "calendar" | "tag" | "external" | "kbd-cmd" | "user"
  | "compass" | "gift";

const MAP: Record<IconName, LucideIcon> = {
  zap: Zap, library: Library, briefcase: Briefcase, flame: Flame,
  wallet: Wallet, image: Image, star: Star, search: Search, settings: Settings,
  send: Send, plus: Plus, users: Users, clock: Clock, baby: Baby,
  ruble: RussianRuble, sparkles: Sparkles, wand: Wand2, puzzle: Puzzle,
  palette: Palette, "arrow-right": ArrowRight, "arrow-up-right": ArrowUpRight,
  "chevron-right": ChevronRight, "chevron-down": ChevronDown, heart: Heart,
  x: X, filter: Filter, play: Play, video: Video, snowflake: Snowflake,
  check: Check, bell: Bell, trophy: Trophy, book: BookOpen, crown: Crown,
  calendar: Calendar, tag: Tag, external: ExternalLink, "kbd-cmd": Command,
  user: User, compass: Compass, gift: Gift,
};

export function Icon({
  n,
  size = 18,
  className,
  "aria-hidden": ariaHidden = true,
}: {
  n: IconName;
  size?: number;
  className?: string;
  "aria-hidden"?: boolean;
}) {
  const Cmp = MAP[n];
  return <Cmp size={size} strokeWidth={2} className={className} aria-hidden={ariaHidden} />;
}
