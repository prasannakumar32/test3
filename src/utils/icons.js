import {
  LocationOn as LocationIcon,
  Numbers as ServiceNumberIcon,
  Speed as CapacityIcon,
  Factory as FactoryIcon,
  WindPower as WindIcon,
  WbSunny as SolarIcon,
  Assessment as ProductionIcon,
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarMonth as CalendarIcon,
  AttachMoney as MoneyIcon,
  ShowChart as ChartIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  MoreVert as MoreIcon,
  Download as DownloadIcon,
  Upload as UploadIcon
} from '@mui/icons-material';

// Site Type Icons
export const siteIcons = {
  WIND: WindIcon,
  SOLAR: SolarIcon
};

// Navigation Icons
export const navigationIcons = {
  back: ArrowBackIcon,
  add: AddIcon,
  production: ProductionIcon
};

// Action Icons
export const actionIcons = {
  edit: EditIcon,
  delete: DeleteIcon,
  save: SaveIcon,
  close: CloseIcon,
  refresh: RefreshIcon,
  search: SearchIcon,
  filter: FilterIcon,
  more: MoreIcon,
  download: DownloadIcon,
  upload: UploadIcon,
  add: AddIcon
};

// Data Icons
export const dataIcons = {
  location: LocationIcon,
  serviceNumber: ServiceNumberIcon,
  capacity: CapacityIcon,
  factory: FactoryIcon,
  calendar: CalendarIcon,
  money: MoneyIcon,
  chart: ChartIcon
};

// Get icon by category and name
export const getIcon = (category, name) => {
  const categories = {
    site: siteIcons,
    navigation: navigationIcons,
    action: actionIcons,
    data: dataIcons
  };
  
  return categories[category]?.[name];
};

// Export individual icons
export {
  LocationIcon,
  ServiceNumberIcon,
  CapacityIcon,
  FactoryIcon,
  WindIcon,
  SolarIcon,
  ProductionIcon,
  AddIcon,
  ArrowBackIcon,
  EditIcon,
  DeleteIcon,
  CalendarIcon,
  MoneyIcon,
  ChartIcon,
  SaveIcon,
  CloseIcon,
  RefreshIcon,
  SearchIcon,
  FilterIcon,
  MoreIcon,
  DownloadIcon,
  UploadIcon
};
