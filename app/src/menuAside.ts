import {
  mdiAccountCircle,
  mdiMonitor,
  mdiGithub,
  mdiAlertCircle,
  mdiSquareEditOutline,
  mdiTable,
  mdiViewList,
  mdiTelevisionGuide,
  mdiResponsive,
  mdiListBox,
  mdiPalette,
  mdiVuejs,
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
        href: '/requests/new',
        label: 'Nuevas Solicitudes',
        icon: mdiListBox,
      },
      {
        href: '/requests/accepted',
        label: 'Aceptadas',
        icon: mdiListBox,
      },
      {
        href: '/requests/rejected',
        label: 'Rechazadas',
        icon: mdiListBox,
      },
    ],
  },
  {
    label: 'Voluntarios',
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
  {
    href: '/email',
    label: 'Envio de correos',
    icon: mdiEmail,
  },
  {
    href: '/hours',
    label: 'Horas',
    icon: mdiClock,
  },
  {
    href: '/profile',
    label: 'Perfil voluntario',
    icon: mdiNaturePeople,
  },
  {
    href: '/programs',
    label: 'Programas de voluntariado',
    icon: mdiHumanHandsup,
  },
  {
    href: '/subsidiaries',
    label: 'Registro de filiales',
    icon: mdiBook,
  },
  {
    href: '/activity-list',
    label: 'Lista de actividades',
    icon: mdiCheck,
  },
  {
    label: 'Styles',
    icon: mdiViewList,
    menu: [
      {
        href: '/dashboard',
        icon: mdiMonitor,
        label: 'Dashboard',
      },
      {
        href: '/tables',
        label: 'Tables',
        icon: mdiTable,
      },
      {
        href: '/forms',
        label: 'Forms',
        icon: mdiSquareEditOutline,
      },
      {
        href: '/ui',
        label: 'UI',
        icon: mdiTelevisionGuide,
      },
      {
        href: '/responsive',
        label: 'Responsive',
        icon: mdiResponsive,
      },
      {
        href: '/',
        label: 'Styles',
        icon: mdiPalette,
      },
      {
        href: '/profile',
        label: 'Profile',
        icon: mdiAccountCircle,
      },
      {
        href: '/error',
        label: 'Error',
        icon: mdiAlertCircle,
      },
      {
        label: 'Dropdown',
        icon: mdiViewList,
        menu: [
          {
            label: 'Item One',
          },
          {
            label: 'Item Two',
          },
        ],
      },
      {
        href: 'https://github.com/justboil/admin-one-react-tailwind',
        label: 'GitHub',
        icon: mdiGithub,
        target: '_blank',
      },
      {
        href: 'https://github.com/justboil/admin-one-vue-tailwind',
        label: 'Vue version',
        icon: mdiVuejs,
        target: '_blank',
      },
    ],
  },
]

export default menuAside
