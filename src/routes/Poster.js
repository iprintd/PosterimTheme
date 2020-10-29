/**
 * This is the Homepage
 * URL : http://<store-domain>/{language-code}/home/
 *
 * @param {object} state - the state of the store
 */
import { UStoreProvider } from '@ustore/core'
import Layout from '../components/Layout'
import Slider from '$core-components/Slider'
import PromotionItem from '../components/PromotionItem'
import { Router } from '$routes'
import Gallery from '$core-components/Gallery'
import CategoryItem from '../components/CategoryItem'
import ProductItem from '../components/ProductItem'
import urlGenerator from '$ustoreinternal/services/urlGenerator'
import { t } from '$themelocalization'
import './Poster.scss'
import { Component } from 'react'
import { getVariableValue } from '$ustoreinternal/services/cssVariables'
import theme from '$styles/_theme.scss'
import { throttle } from 'throttle-debounce'
import { getIsNGProduct } from '../services/utils'
import { decodeStringForURL } from '$ustoreinternal/services/utils'
import $ from 'jquery';

class Poster extends Component {

  constructor(props) {
    super(props)

    this.state = {
      isMobile: false,
      promotionItemButtonUrl: ''
    }

  }

  componentDidMount() {
    $("#left-payments span").html("* בשעות הפעילות");
    $("#left-payments-mobile").html("* בשעות הפעילות");

    window.addEventListener('resize', this.onResize.bind(this));
    throttle(250, this.onResize);					// Call this function once in 250ms only

    this.onResize()
  }

  componentWillUnmount() {
    
    window.removeEventListener('resize', this.onResize)
    this.clearCustomState()
  }

  clearCustomState() {
    UStoreProvider.state.customState.delete('posterFeaturedProducts')
    UStoreProvider.state.customState.delete('posterFeaturedCategory')
  }

  onResize() {
    this.setState({ isMobile: document.body.clientWidth < parseInt(theme.md.replace('px', '')) })
  }

  static getDerivedStateFromProps(props, state) {
    if (!(props.state && props.customState)) {
      return null
    }

    const { categories } = props.customState
    //NOTE: this is not supported in SSR
    if (categories && categories.length && !state.promotionItemButtonUrl.length) {
      const { FriendlyID, Name } = categories[0]
      const defaultURL = urlGenerator.get({ page: 'category', id: FriendlyID, name: decodeStringForURL(Name) })
      return { promotionItemButtonUrl: getVariableValue('--homepage-carousel-slide-1-button-url', defaultURL, false, true) }
    }
    return null
  }



  render() {
    if (!this.props.state) {
      return null
    }

    const { customState: { categories, posterFeaturedProducts, posterFeaturedCategory } } = this.props
    const amount_icon =  require(`$assets/images/amount.png`)
    const upload_icon =  require(`$assets/images/upload.png`)
    const delivery_icon =  require(`$assets/images/delivery.png`)
    const step_icon =  require(`$assets/images/item_arr.png`)

    const left_banner_img =  require(`$assets/images/banner_img.png`)


    const promotionItemImageUrl = getVariableValue('--homepage-carousel-slide-1-image', require(`$assets/images/banner_image.png`), true)
    const promotionItemTitle = getVariableValue('--homepage-carousel-slide-1-main-text', t('PromotionItem.Title'))
    const promotionItemSubtitle = getVariableValue('--homepage-carousel-slide-1-sub-text', t('PromotionItem.Subtitle'))
    const promotionItemButtonText = getVariableValue('--homepage-carousel-slide-1-button-text', t('PromotionItem.Button_Text'))

    return (
      <Layout {...this.props} className="home">
      <div id="header_bottom"></div>        
        <div className="promotion-wrapper">
          <div className="wrapper">
          <Slider>
            <PromotionItem
              imageUrl={promotionItemImageUrl}
              title={promotionItemTitle}
              subTitle={promotionItemSubtitle}
              buttonText={promotionItemButtonText}
              url={this.state.promotionItemButtonUrl}
            />
          </Slider>
          </div>
        </div>
        <div className="how-works">
          <div class="wrapper">
            <div class="how-works-title">
              אז איך זה עובד?
            </div>
            <div class="how-works-items">
              <div class="how-works-item">
                <div class="how-works-item-img">
                {upload_icon && <img src={upload_icon} alt="Upload" />}
                </div>
                <span>מעלים קובץ</span>
                <p>
                  מעלים קובץ PDF בגודל 50X70
                </p>
              </div>
            </div>           
            <div class="next-step-img">
            {step_icon && <img src={step_icon} className="next-step" alt="Next step" />}
            </div>
            <div class="how-works-items">
              <div class="how-works-item">
                <div class="how-works-item-img">
                {amount_icon && <img src={amount_icon} alt="Amount" />}
                </div>
                <span>בוחרים כמות</span>
                <p>
                  בוחרים כמה פוסטרים רוצים
                </p>
              </div>
            </div>
            <div class="next-step-img">
            {step_icon && <img src={step_icon} className="next-step" alt="Next step" />}
            </div>
            <div class="how-works-items">
              <div class="how-works-item">
                <div class="how-works-item-img">
                {delivery_icon && <img src={delivery_icon}  style={{marginTop: "37px"}} alt="Delivery" />}
                </div>
                <span>בדרך אליכם</span>
                <p>
                  איסוף מהמפעל תוך שעתיים בלבד*<br></br>
                  אפשרות למשלוח לכל רחבי הארץ
                </p>
              </div>
            </div>
          </div>
        </div>
        {/*
        <div className="middle-section">
          {categories && categories.length > 0 &&
            <div className="categories-wrapper">
              <Slider multi>
                {
                  categories.map((model) => {
                    return <CategoryItem key={model.ID} model={model}
                      url={urlGenerator.get({ page: 'category', id: model.FriendlyID, name: decodeStringForURL(model.Name) })} />
                  }
                  )
                }
              </Slider>
            </div>
          }

          <div className="divider" />
          {posterFeaturedCategory && posterFeaturedProducts &&
            <div className="featured-products-wrapper">
              <Gallery title={posterFeaturedCategory.Name}
                seeAllUrl={urlGenerator.get({ page: 'category', id: posterFeaturedCategory.FriendlyID, name: decodeStringForURL(posterFeaturedCategory.Name) })}
                gridRows="2">
                {
                  posterFeaturedProducts.map((model) => {
                    const hideProduct =
                      this.state.isMobile &&
                      model.Attributes &&
                      model.Attributes.find(attr => attr.Name === 'UEditEnabled' && attr.Value === 'true') !== undefined

                    return !hideProduct &&
                      <ProductItem
                        key={model.ID}
                        model={model}
                        productNameLines="2"
                        descriptionLines="4"
                        url={getIsNGProduct(model.Type) ?
                          urlGenerator.get({ page: 'products', id: model.FriendlyID, name: decodeStringForURL(model.Name) })
                          :
                          urlGenerator.get({ page: 'product', id: model.FriendlyID, name: decodeStringForURL(model.Name) })
                        }
                      />
                  })
                }
              </Gallery>
            </div>
          }
        </div>
        */}
      </Layout>
    )
  }
}

Poster.getInitialProps = async function (ctx) {
  const maxInPage = 200
  const { Count } = await UStoreProvider.api.categories.getTopCategories(1, maxInPage)
  if (Count === 0) {
    return { posterFeaturedProducts: null, posterFeaturedCategory: null }
  }

  const page = Math.ceil(Count / maxInPage)
  const { Categories } = await UStoreProvider.api.categories.getTopCategories(page, maxInPage)

  if (Categories.length === 0) {
    return { posterFeaturedProducts: null, posterFeaturedCategory: null }
  }

  const posterFeaturedCategory = Categories[Count - 1]
  const { Products: posterFeaturedProducts } = await UStoreProvider.api.products.getProducts(posterFeaturedCategory.ID, 1)
  return { posterFeaturedProducts, posterFeaturedCategory }
}

export default Poster
