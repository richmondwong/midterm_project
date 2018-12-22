$(document).ready(function(){

  //hide sms input box if the sms has already been sent.
  function hideCompSms() {

    let smsFlag = $('.sms_sent');

    smsFlag.each( (x) => {
      //console.log("sms flag:", $(smsFlag[x]).val());
      if (!$(smsFlag[x]).val()){
        $(smsFlag[x]).parent().removeClass('hide');
      }
    })
  }

  hideCompSms();
})
