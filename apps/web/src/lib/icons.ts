/**
 * Centralized Icon Imports
 * Import only used icons from lucide-react for better tree shaking
 */

export {
  Heart,
  ShoppingCart,
  Star,
  ArrowRight,
  TrendingUp,
  Award,
  Users,
  Sparkles,
  Menu,
  X,
  Search,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Filter,
  SlidersHorizontal,
  Grid,
  List,
  Check,
  Plus,
  Minus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  LogOut,
  Settings,
  Bell,
  Package,
  Truck,
  CreditCard,
  MapPin,
  Phone,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  ExternalLink,
  Download,
  Upload,
  Share2,
  Copy,
  Loader2,
} from 'lucide-react'

/**
 * This approach enables better tree shaking compared to:
 * import { Heart, ShoppingCart, ... } from 'lucide-react' in every file
 *
 * Benefits:
 * 1. Single source of truth for icons
 * 2. Better bundle size optimization
 * 3. Easier to track which icons are used
 * 4. Simple to add/remove icons
 */
