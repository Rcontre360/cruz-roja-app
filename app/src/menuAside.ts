import {
  mdiAccountCircle,
  mdiMonitor,
  mdiAlertCircle,
  mdiSquareEditOutline,
  mdiTable,
  mdiViewList,
  mdiTelevisionGuide,
  mdiResponsive,
  mdiListBox,
  mdiPalette,
  mdiPlus,
  mdiEmail,
  mdiClock,
  mdiNaturePeople,
  mdiBook,
  mdiCheck,
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
    label: 'Voluntarios [TODO]',
    icon: mdiAccountCircle,
    menu: [
      {
        href: '/volunteers/list',
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
  //{
  //href: '/email',
  //label: 'Envio de correos',
  //icon: mdiEmail,
  //},
  {
    href: '/hours',
    label: 'Horas [TODO]',
    icon: mdiClock,
  },
  {
    href: '/profile',
    label: 'Perfil voluntario [TODO]',
    icon: mdiNaturePeople,
  },
  {
    href: '/programs',
    label: 'Programas de voluntariado',
    icon: mdiHumanHandsup,
  },
  {
    href: '/subsidiaries',
    label: 'Registro de filiales [TODO]',
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
