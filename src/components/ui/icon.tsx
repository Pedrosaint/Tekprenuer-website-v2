import {
  AiBrain01Icon, Award01Icon, Book02Icon, Building03Icon, ElectricTower01Icon, Hospital01Icon, ChartIncreaseIcon, ChartUpIcon, Clock01Icon, CodeIcon, CodeSquareIcon, Compass01Icon,
  CpuIcon, CustomerSupportIcon, HammerIcon, HandshakeIcon, Idea01Icon, InfinityCircleIcon, Layout01Icon, Location01Icon,
  Megaphone01Icon, Message01Icon, PackageIcon, PaintBoardIcon, PenTool03Icon, Rocket01Icon, Rocket02Icon, Shield01Icon,
  ShoppingCart01Icon, TaskDone01Icon, UserGroupIcon,
} from '@hugeicons/core-free-icons'
import type { IconSvgElement } from '@hugeicons/react'
import type { IconKey } from '../../data/site-content'
import { HugeIcon } from './huge-icon'

const icons: Record<IconKey, IconSvgElement> = {
  brain: AiBrain01Icon,
  code: CodeIcon,
  layout: Layout01Icon,
  cpu: CpuIcon,
  palette: PaintBoardIcon,
  clipboard: TaskDone01Icon,
  cart: ShoppingCart01Icon,
  megaphone: Megaphone01Icon,
  rocket: Rocket01Icon,
  users: UserGroupIcon,
  package: PackageIcon,
  compass: Compass01Icon,
  hammer: HammerIcon,
  'trending-up': ChartUpIcon,
  lightbulb: Idea01Icon,
  handshake: HandshakeIcon,
  award: Award01Icon,
  shield: Shield01Icon,
  clock: Clock01Icon,
  infinity: InfinityCircleIcon,
  design: PenTool03Icon,
  development: CodeSquareIcon,
  launch: Rocket02Icon,
  growth: ChartIncreaseIcon,
  support: CustomerSupportIcon,
  message: Message01Icon,
  location: Location01Icon,
  education: Book02Icon,
  healthcare: Hospital01Icon,
  property: Building03Icon,
  utilities: ElectricTower01Icon,
}

interface IconProps {
  name: IconKey
  className?: string
  size?: number
}

/** Content icons by key (see IconKey in site-content.ts). */
export function Icon({ name, className, size = 24 }: IconProps) {
  return <HugeIcon icon={icons[name]} className={className} size={size} />
}
