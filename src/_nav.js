export default [
  {
    component: 'CNavItem',
    name: 'Tổng quan',
    to: '/dashboard',
    icon: 'cil-speedometer',
    badge: {
      color: 'primary',
      text: 'NEW',
    },
  },
  {
    component: 'CNavTitle',
    name: 'Phòng học',
  },
  {
    component: 'CNavItem',
    name: 'Đặt phòng',
    to: '/booking/booking-room',
    icon: 'cil-calendar',
  },
  {
    component: 'CNavItem',
    name: 'Giảng viên đặt lịch',
    to: '/booking/lecturer',
    icon: 'cil-calendar',
  },
  {
    component: 'CNavItem',
    name: 'Chờ duyệt',
    to: '/booking/booking-await',
    icon: 'cil-task',
  },
  {
    component: 'CNavItem',
    name: 'Lịch sử đặt phòng',
    to: '/booking/booking-history',
    icon: 'cil-pencil',
  },
  {
    component: 'CNavTitle',
    name: 'Danh mục',
  },
  {
    component: 'CNavGroup',
    name: 'Phòng',
    to: '/dictionary',
    icon: 'cil-envelope-open',
    items: [
      {
        component: 'CNavItem',
        name: 'Phòng học',
        to: '/dictionary/room',
      },
      {
        component: 'CNavItem',
        name: 'Môn học',
        to: '/dictionary/subject',
      },
      // {
      //   component: 'CNavItem',
      //   name: 'Loại phòng học',
      //   to: '/dictionary/room-type',
      // },
      {
        component: 'CNavItem',
        name: 'Tòa nhà',
        to: '/dictionary/building',
      },
      // {
      //   component: 'CNavItem',
      //   name: 'Ca học',
      //   to: '/dictionary/timeslot',
      // },
      {
        component: 'CNavItem',
        name: 'Thiết bị',
        to: '/dictionary/equipment',
      },
      {
        component: 'CNavItem',
        name: 'Lớp học',
        to: '/dictionary/class',
      },
      // {
      //   component: 'CNavItem',
      //   name: 'Loại thiết bị',
      //   to: '/dictionary/equipment-type',
      // },
    ],
  },
  {
    component: 'CNavGroup',
    name: 'Người dùng',
    to: '/dictionary',
    icon: 'cil-user',
    items: [
      {
        component: 'CNavItem',
        name: 'Người dùng',
        to: '/dictionary/user',
      },
      {
        component: 'CNavItem',
        name: 'Sinh viên',
        to: '/dictionary/student',
      },
      {
        component: 'CNavItem',
        name: 'Vai trò',
        to: '/dictionary/role',
      },
      {
        component: 'CNavItem',
        name: 'Khoa',
        to: '/dictionary/department',
      },
    ],
  },

  {
    component: 'CNavTitle',
    name: 'Chức năng khác',
    icon: 'cil-user',
    items: [
      {
        component: 'CNavItem',
        name: 'Điểm danh',
        to: '/attendance/attendance',
      },
    ],
  },
]
