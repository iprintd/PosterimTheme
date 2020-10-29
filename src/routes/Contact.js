/**
 * This is the Homepage
 * URL : http://<store-domain>/{language-code}/home/
 *
 * @param {object} state - the state of the store
 */
import { UStoreProvider } from '@ustore/core'
import Layout from '../components/Layout'
import { Router } from '$routes'
import urlGenerator from '$ustoreinternal/services/urlGenerator'
import { t } from '$themelocalization'
import './Contact.scss'
import { Component } from 'react'
import { getVariableValue } from '$ustoreinternal/services/cssVariables'
import theme from '$styles/_theme.scss'
import { throttle } from 'throttle-debounce'
import { getIsNGProduct } from '../services/utils'
import { decodeStringForURL } from '$ustoreinternal/services/utils'
import $ from 'jquery';

class Contact extends Component {

  constructor(props) {
    super(props)

    this.state = {
      fname: UStoreProvider.state.get().currentUser.FirstName,
      lname: UStoreProvider.state.get().currentUser.LastName,
      phone: UStoreProvider.state.get().currentUser.MobileNumber,
      mail: UStoreProvider.state.get().currentUser.Email,
      message: 'תוכן הפנייה',
      validateMsg: '',
      errors: [false, false, false, false],
      subject: 'פנייה כללית',
      isMobile: false,
      promotionItemButtonUrl: '', 
    }


  }
  
  handleLnameFocus = () => {
    this.state.errors[1] = false;
    this.forceUpdate()
  };
  handleFnameFocus = () => {
    this.state.errors[0] = false;
    this.forceUpdate()
  };
  handleMailFocus = () => {
    this.state.errors[2] = false;
    this.forceUpdate()
  };
  handleMobileFocus = () => {
    this.state.errors[3] = false;
    this.forceUpdate()
  };

  handleMsgFocus = () => {
    if(this.state.message =="תוכן הפנייה") {
        this.state.message ="";
    }
    this.forceUpdate()
  };

  handleMsgBlur = () => {
    if(this.state.message =="") {
        this.state.message ="תוכן הפנייה";
    }
    this.forceUpdate()
  };



  resetForm(){
    this.setState({fname:  '', lname: '', phone: '', mail: '', message: 'תוכן הפנייה', subject: 'פנייה כללית'})
  }


  handleSubmit(e) {
        e.preventDefault();
        function validateEmail(email) 
        {
            var re = /\S+@\S+\.\S+/;
            return re.test(email);
        }

        function validatePhone(txtPhone) {
            var filterM = /^05/g;
            var filter = /^(?:\+?\d{2}[ -]?\d{3}[ -]?\d{4}|\d{3})$/gm;
            var filterB = /^(?:\+?\d{3}[ -]?\d{3}[ -]?\d{4}|\d{3})$/gm;
            if(filterM.test(txtPhone)) {
                if(filterB.test(txtPhone)){
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                if(filter.test(txtPhone)){
                    return true;	
                }
                else {
                    return false;
                }
            }
          
        }
    
        var flag = true;
        if(this.state.fname.length<3) {
            this.state.errors[0] = true;
            this.forceUpdate()
            flag = false;
        }
        else {
            this.state.errors[0] = false;
        }

        if(this.state.lname.length<3) {
            this.state.errors[1] = true;
            this.forceUpdate()
            flag = false;
        }
        else {
            this.state.errors[1] = false;
        }

        if(!validateEmail(this.state.mail)) {
            this.state.errors[2] = true;
            this.forceUpdate()
            flag = false;
        }
        else {
            this.state.errors[2] = false;
        }

        if(this.state.phone.length > 0) {
            if(!validatePhone(this.state.phone)) {
                this.state.errors[3] = true;
                this.forceUpdate()
                flag = false;    
            }
        }
        
        if(flag) {
        
            fetch('http://172.16.0.30:51080/XMPie/Contact', {
                method: "POST",
                body: JSON.stringify(this.state),
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
              }).then(
              (response) => (response.json())
                ).then((response)=> {
    
            if (response.status == true) {
                this.setState({validateMsg: "הפנייה נשלחה בהצלחה"});
                this.resetForm()
              } else  {
                this.setState({validateMsg: "שגיאה בשליחת טופס לשרת"});
              }
            })
        }
}
onFnameChange(event) {
	  this.setState({fname: event.target.value})
  }

  onLnameChange(event) {
    this.setState({lname: event.target.value})
}

  onMobileChange(event) {
    this.setState({phone: event.target.value})
}

onSubjectChange(event) {
    this.setState({subject: event.target.value})
}

  onEmailChange(event) {
	  this.setState({mail: event.target.value})
  }

  onMessageChange(event) {
	  this.setState({message: event.target.value})
  }

  componentDidMount() {

    /*
    <script type="text/javascript"
    src="https://cdn.jsdelivr.net/npm/emailjs-com@2/dist/email.min.js">
</script>

    
    const fname = UStoreProvider.state.get().currentUser.FirstName;
    const lname = UStoreProvider.state.get().currentUser.LastName;  
    const email = UStoreProvider.state.get().currentUser.Email;     
    const phone = UStoreProvider.state.get().currentUser.MobileNumber;      
    //const getAllParams = UStoreProvider.state.get().currentUser;
   // console.log("this is::"+Object.keys(getAllParams));
    $('#cname').val(fname+" "+lname);
    $('#mail').val(email);
     emailjs.init("user_ZFrjiufExQY7p1G8fzuik");

     var templateParams = {
        name: $('#cname').val(),
        mail: $('#mail').val(),
        subject: $('#subject').val(),
        message: $('#message').val()
    };
    $('#send').on("click", function (){
        emailjs.send('service_ra1pbrm', 'template_2zp5xzi', templateParams)
        .then(function(response) {
           console.log('SUCCESS!', response.status, response.text);
        }, function(error) {
           console.log('FAILED...', error);
        });
    });
    */
   /*
   const fname = UStoreProvider.state.get().currentUser.FirstName;
   const lname = UStoreProvider.state.get().currentUser.LastName;  
   const email = UStoreProvider.state.get().currentUser.Email;     
   const phone = UStoreProvider.state.get().currentUser.MobileNumber;      
   //const getAllParams = UStoreProvider.state.get().currentUser;
   */
  // console.log("this is::"+Object.keys(getAllParams));

    /*
    e.preventDefault(); // avoid to execute the actual submit of the form.

    var form = $(this);
    var url = form.attr('action');
    
    $.ajax({
           type: "POST",
           url: url,
           data: form.serialize(), // serializes the form's elements.
           success: function(data)
           {
               alert(data); // show response from the php script.
           }
         });

});
*/
if(this.state.fname=="Anonymous") {
    this.setState({ fname: ""});
    this.setState({ lname: ""});
}

if(this.state.mail.includes("uStore")) {
    this.setState({ mail: ""});
}



}

  componentWillUnmount() {
    
    window.removeEventListener('resize', this.onResize)
    this.clearCustomState()
  }

  clearCustomState() {
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
    return null
  }



  render() {
    const mail =  require(`$assets/images/mail-icon.png`)  
    const geo =  require(`$assets/images/geo-icon.png`)  
    const time =  require(`$assets/images/time-icon.png`)  

    if (!this.props.state) {
      return null
    }

    const { customState: { currentUser } } = this.props

    return (
      <Layout {...this.props} className="contactUs">
          <div id="title_contact">
              צרו קשר
          </div>
        <div className="container-fluid">
 
<div id="contactMap">
        <span id="contactTitle">זול דפוס לואו קוסט</span>
        <ul id="bottom-contact">
            <li id="last-info"><span>{time && <img src={time} alt="שעות פעילות" />} </span><p>א' - ה' 18:00 - 09:00<br></br>ו' וערבי חג 14:00 - 09:00</p></li>
            <li>{geo && <img src={geo} alt="מיקום" />}הסיבים 43 פתח תקווה</li>
        </ul>
        <div class="mapouter"><div class="gmap_canvas"><iframe width="100%" height="215" id="gmap_canvas" src="https://maps.google.com/maps?q=%D7%94%D7%A1%D7%99%D7%91%D7%99%D7%9D%2043%20%D7%A4%D7%AA%D7%97%20%D7%AA%D7%A7%D7%95%D7%95%D7%94&t=&z=15&ie=UTF8&iwloc=&output=embed" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe></div></div>       
</div>

<div id="contactForm" style={{marginBottom: "120px"}}>
    <span id="titleForm">דברו איתנו</span>
יש לכם שאלה? צריכים עזרה? אנחנו עונים מהר!
<form id="contact" onSubmit={this.handleSubmit.bind(this)} method="POST">
    <div class="mid-input"><label>שם פרטי <span class="must">*</span></label><input type="text" name="fname" className={this.state.errors[0] ? "form-input-fail" : "form-input"} value={this.state.fname} onChange={this.onFnameChange.bind(this)} onFocus={this.handleFnameFocus}></input></div>
    <div class="mid-input left-mid-input"><label>שם משפחה <span class="must">*</span></label><input type="text" name="lname" className={this.state.errors[1] ? "form-input-fail" : "form-input"} value={this.state.lname} onChange={this.onLnameChange.bind(this)} onFocus={this.handleLnameFocus}></input></div>
    <div class="mid-input"><label>דואר אלקטרוני <span class="must">*</span></label><input type="text" name="mail" id="email"  value={this.state.mail} className={this.state.errors[2] ? "form-input-fail" : "form-input"} onChange={this.onEmailChange.bind(this)} onFocus={this.handleMailFocus}></input></div>    
    <div class="mid-input left-mid-input"><label>טלפון נייד</label><input type="text" name="phone" id="mobphone"  value={this.state.phone} className={this.state.errors[3] ? "form-input-fail" : "form-input"}  onChange={this.onMobileChange.bind(this)} onFocus={this.handleMobileFocus}></input></div> 

    <div class="full-width-input"><label>נושא</label><select name="subject" value={this.state.subject} onChange={this.onSubjectChange.bind(this)}>
        <option>פנייה כללית</option>
        <option>דיווח על בעיה בהזמנה</option>
        <option>תמיכה טכנית</option>
        <option>הצעת ייעול</option>
    </select></div>
    <textarea name="message" id="message" value={this.state.message} onChange={this.onMessageChange.bind(this)} onFocus={this.handleMsgFocus} onBlur={this.handleMsgBlur}>
        תוכן הפנייה
    </textarea>
    <span id="validateMsg">{this.state.validateMsg}</span>
   <input type="submit" name="form" value="שליחה" id="send"></input>
</form>
</div>


        </div>
        {/*
        <script type="text/javascript"
        src="https://cdn.jsdelivr.net/npm/emailjs-com@2/dist/email.min.js">
</script>
        */}
      </Layout>
    )
  }
}

Contact.getInitialProps = async function (ctx) {
  const maxInPage = 200
}

export default Contact
