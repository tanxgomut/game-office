export default defineNuxtRouteMiddleware((to, from) => {
  const isLogin = useCookie('isLogin')

  if (!isLogin.value && to.path !== '/') {
    return navigateTo('/')
  } else if (isLogin.value && to.path === '/') {
    return navigateTo('/member')
  }
})
