import { defineComponent, h, onMounted, ref, resolveComponent } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import {
  CBadge,
  CSidebarNav,
  CNavItem,
  CNavGroup,
  CNavTitle,
} from '@coreui/vue'
import nav from '@/_nav.js'

const normalizePath = (path) =>
  decodeURI(path)
    .replace(/#.*$/, '')
    .replace(/(index)?\.(html)$/, '')

const isActiveLink = (route, link) => {
  if (link === undefined) {
    return false
  }

  if (route.hash === link) {
    return true
  }

  const currentPath = normalizePath(route.path)
  const targetPath = normalizePath(link)

  return currentPath === targetPath
}

const isActiveItem = (route, item) => {
  if (isActiveLink(route, item.to)) {
    return true
  }

  if (item.items) {
    return item.items.some((child) => isActiveItem(route, child))
  }

  return false
}

const AppSidebarNav = defineComponent({
  name: 'AppSidebarNav',
  components: {
    CNavItem,
    CNavGroup,
    CNavTitle,
  },
  setup() {
    const route = useRoute()
    const firstRender = ref(true)

    onMounted(() => {
      firstRender.value = false
    })

    const renderItem = (item) => {
      if (item.to === '/dashboard') {
        return null
      }
      if (
        item.to === '/booking/booking-room' &&
        localStorage.getItem('roleOption') - 0 === 1
      ) {
        return null
      }
      if (
        item.name == 'Danh mục' &&
        (localStorage.getItem('roleOption') - 0 === 1 ||
          localStorage.getItem('roleOption') - 0 === 10)
      ) {
        return null
      }
      if (
        item.name == 'Chức năng khác' &&
        localStorage.getItem('roleOption') - 0 !== 1 &&
        localStorage.getItem('roleOption') - 0 !== 2
      ) {
        return null
      }
      if (
        item.to == '/booking/lecturer' &&
        localStorage.getItem('roleOption') - 0 === 10
      ) {
        return null
      }
      if (
        (item.name == 'Danh mục' || item.name == 'Phòng') &&
        localStorage.getItem('roleOption') - 0 === 3
      ) {
        return null
      }

      if (
        item.to == '/dictionary' &&
        (localStorage.getItem('roleOption') - 0 === 1 ||
          localStorage.getItem('roleOption') - 0 === 10)
      ) {
        return null // Return null to hide the item
      }
      if (
        (item.to === '/booking/booking-history' ||
          item.to === '/dashboard' ||
          item.to == '/booking/booking-room' ||
          item.to == '/dictionary') &&
        localStorage.getItem('roleOption') - 0 === 3
      ) {
        return null // Return null to hide the item
      }
      if (item.items) {
        return h(
          CNavGroup,
          {
            ...(firstRender.value && {
              visible: item.items.some((child) => isActiveItem(route, child)),
            }),
          },
          {
            togglerContent: () => [
              h(resolveComponent('CIcon'), {
                customClassName: 'nav-icon',
                name: item.icon,
              }),
              item.name,
            ],
            default: () => item.items.map((child) => renderItem(child)),
          },
        )
      }

      return item.to
        ? h(
            RouterLink,
            {
              to: item.to,
              custom: true,
            },
            {
              default: (props) =>
                h(
                  resolveComponent(item.component),
                  {
                    active: props.isActive,
                    href: props.href,
                    onClick: () => props.navigate(),
                  },
                  {
                    default: () => [
                      item.icon &&
                        h(resolveComponent('CIcon'), {
                          customClassName: 'nav-icon',
                          name: item.icon,
                        }),
                      item.name,
                      item.badge &&
                        h(
                          CBadge,
                          {
                            class: 'ms-auto',
                            color: item.badge.color,
                          },
                          {
                            default: () => item.badge.text,
                          },
                        ),
                    ],
                  },
                ),
            },
          )
        : h(
            resolveComponent(item.component),
            {},
            {
              default: () => item.name,
            },
          )
    }

    return () =>
      h(
        CSidebarNav,
        {},
        {
          default: () => nav.map((item) => renderItem(item)),
        },
      )
  },
})
export { AppSidebarNav }
