import React from 'react'
import HeadSEO from './HeadSEO'
import Header from './Header'
import Footer from './Footer'
import './Layout.scss'
import CookiesRibbon from "./CookiesRibbon";
import themeContext from "$ustoreinternal/services/themeContext";
import { isServer } from '$ustoreinternal/services/utils'

/**
 * The main page wrapper - contains the Header and Footer and gets children as the main content
 *
 * @param {object} state - state of store
 * @param {component} children - React components to be presented between header and footer
 * @param {string} [className] - class name to append to the container div
 */
const Layout = ({ state, children, className }) => {

  let isPreviewMode = false
  if (!isServer()) {
    const url = window.top.location.href
    if (url.includes('MobilePreview.aspx') || url.includes('ThemeCustomization.aspx'))
      isPreviewMode = true
  }


  return (
    <div>
      <HeadSEO {...state} />
      <div className={`layout ${className ? className : ''} ${isPreviewMode ? 'preview' : ''}`}>
        <Header {...state} />
        <div className="main-content">
          {children}
        </div>
        <Footer />
        {state.customState && state.currentStore && <CookiesRibbon IsB2C={state.currentStore.StoreType === 2} showRibbon={state.customState.showCookieRibbon} />}
      </div>
    </div>
  )
}

export default Layout
