$(document).ready(function(){

  //Show sms input box if the SMS has NOT been sent yet.
  function showCompSms() {

    let smsFlag = $('.sms_sent');

    smsFlag.each( (x) => {

      if (!$(smsFlag[x]).val()){
        $(smsFlag[x]).parent().removeClass('hide');
        $(smsFlag[x]).parent().siblings('.comp_time').addClass('hide');
      }
    })
  }

  showCompSms();
})
