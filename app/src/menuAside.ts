import {
  mdiAccountCircle,
  mdiTable,
  mdiListBox,
  mdiPlus,
  mdiClock,
  mdiNaturePeople,
  mdiBook,
  mdiCheck,
  mdiPin,
  mdiHumanHandsup,
} from '@mdi/js'
import {MenuAsideItem} from './interfaces'

const menuAside: MenuAsideItem[] = [
  {
    href: '/dashboard',
    label: 'Inicio',
    icon: mdiTable,
  },
  {
    label: 'Solicitudes',
    icon: mdiAccountCircle,
    menu: [
      {
        href: '/requests/',
        label: 'Listado de Solicitudes',
        icon: mdiListBox,
      },
      {
        href: '/requests/new',
        label: 'Crear solicitud',
        icon: mdiListBox,
      },
    ],
  },
  {
    label: 'Voluntarios',
    icon: mdiAccountCircle,
    menu: [
      {
        href: '/volunteers',
        label: 'Lista de voluntarios',
        icon: mdiListBox,
      },
      {
        href: '/volunteers/new',
        label: 'Nuevo voluntario',
        icon: mdiPlus,
      },
    ],
  },
  {
    label: 'Actividades [ONLY MOCK]',
    icon: mdiPin,
    menu: [
      {
        href: '/activities/',
        label: 'Lista de actividades',
        icon: mdiListBox,
      },
      {
        href: '/activities/new',
        label: 'Nueva actividad',
        icon: mdiPlus,
      },
    ],
  },
    {
    label: 'Horas [ONLY MOCK]',
    icon: mdiClock,
    menu: [
      {
        href: '/hours/',
        label: 'Lista de horas',
        icon: mdiListBox,
      },
      {
        href: '/hours/new',
        label: 'Nueva hora',
        icon: mdiPlus,
      },
    ],
  },
  {
    href: '/profile',
    label: 'Perfil voluntario [HELP-RELATED WITH REGISTER]',
    icon: mdiNaturePeople,
  },
  {
    href: '/programs',
    label: 'Programas de voluntariado',
    icon: mdiHumanHandsup,
  },
  {
    href: '/subsidiaries',
    label: 'Registro de filiales [ONLY MOCK]',
    icon: mdiBook,
  },
  //{
  //label: 'Styles',
  //icon: mdiViewList,
  //menu: [
  //{
  //href: '/styles/dashboard',
  //icon: mdiMonitor,
  //label: 'Dashboard',
  //},
  //{
  //href: '/styles/tables',
  //label: 'Tables',
  //icon: mdiTable,
  //},
  //{
  //href: '/styles/forms',
  //label: 'Forms',
  //icon: mdiSquareEditOutline,
  //},
  //{
  //href: '/styles/ui',
  //label: 'UI',
  //icon: mdiTelevisionGuide,
  //},
  //{
  //href: '/styles/responsive',
  //label: 'Responsive',
  //icon: mdiResponsive,
  //},
  //{
  //href: '/styles/',
  //label: 'Styles',
  //icon: mdiPalette,
  //},
  //{
  //href: '/styles/profile',
  //label: 'Profile',
  //icon: mdiAccountCircle,
  //},
  //{
  //href: '/styles/error',
  //label: 'Error',
  //icon: mdiAlertCircle,
  //},
  //{
  //label: 'Dropdown',
  //icon: mdiViewList,
  //menu: [
  //{
  //label: 'Item One',
  //},
  //{
  //label: 'Item Two',
  //},
  //],
  //},
  //],
  //},
]

export default menuAside
