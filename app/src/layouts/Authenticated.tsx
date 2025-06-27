import React, {useEffect} from 'react'
import {useState} from 'react'
import {mdiForwardburger, mdiBackburger, mdiMenu} from '@mdi/js'
import menuAside from '../menuAside'
import menuNavBar from '../menuNavBar'
import Icon from '../components/Icon'
import NavBar from '../components/NavBar'
import NavBarItemPlain from '../components/NavBar/Item/Plain'
import AsideMenu from '../components/AsideMenu'
import FormField from '../components/Form/Field'
import {Field, Form, Formik} from 'formik'
import {useRouter} from 'next/router'
import {useAppDispatch, useAppSelector} from '../stores/hooks'
import {onGetHours, onGetProfile} from '../stores/actions/users'
import {onGetRequests} from '../stores/actions/requests'
import {onGetPrograms} from '../stores/actions/programs'

export default function LayoutAuthenticated({children}: React.PropsWithChildren<unknown>) {
  const {user, token, loaded} = useAppSelector((state) => state.user)
  const [isAsideMobileExpanded, setIsAsideMobileExpanded] = useState(false)
  const [isAsideLgActive, setIsAsideLgActive] = useState(false)

  const dispatch = useAppDispatch()
  const router = useRouter()

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setIsAsideMobileExpanded(false)
      setIsAsideLgActive(false)
    }

    router.events.on('routeChangeStart', handleRouteChangeStart)

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart)
    }
  }, [router.events])

  const layoutAsidePadding = 'xl:pl-60'

  React.useEffect(() => {
    if (!user.email && !token && loaded) router.push('/')
  }, [user, token, loaded, router])

  React.useEffect(() => {
    dispatch(onGetProfile())
    dispatch(onGetRequests())
    dispatch(onGetPrograms())
    dispatch(onGetHours())
  }, [dispatch])

  return (
    <div className={`overflow-hidden lg:overflow-visible`}>
      <div
        className={`${layoutAsidePadding} ${isAsideMobileExpanded ? 'ml-60 lg:ml-0' : ''
          } pt-14 min-h-screen w-screen transition-position lg:w-auto bg-gray-50 dark:bg-slate-800 dark:text-slate-100`}
      >
        {loaded && user.email && (
          <>
            <NavBar
              menu={menuNavBar}
              className={`${layoutAsidePadding} ${isAsideMobileExpanded ? 'ml-60 lg:ml-0' : ''}`}
            >
              <NavBarItemPlain
                display="flex lg:hidden"
                onClick={() => setIsAsideMobileExpanded(!isAsideMobileExpanded)}
              >
                <Icon path={isAsideMobileExpanded ? mdiBackburger : mdiForwardburger} size="24" />
              </NavBarItemPlain>
              <NavBarItemPlain
                display="hidden lg:flex xl:hidden"
                onClick={() => setIsAsideLgActive(true)}
              >
                <Icon path={mdiMenu} size="24" />
              </NavBarItemPlain>
              <NavBarItemPlain useMargin>
                <Formik
                  initialValues={{
                    search: '',
                  }}
                  onSubmit={(values) => alert(JSON.stringify(values, null, 2))}
                >
                  <Form>
                    <FormField isBorderless isTransparent>
                      <Field name="search" placeholder="Search" />
                    </FormField>
                  </Form>
                </Formik>
              </NavBarItemPlain>
            </NavBar>
            <AsideMenu
              isAsideMobileExpanded={isAsideMobileExpanded}
              isAsideLgActive={isAsideLgActive}
              menu={menuAside}
              onAsideLgClose={() => setIsAsideLgActive(false)}
            />
            {children}
          </>
        )}
      </div>
    </div>
  )
}
