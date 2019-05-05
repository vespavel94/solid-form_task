<template>
  <div id="root">
    
    <div id="form">
      <div 
        class="intro" 
        v-if="currentStep==1">
        <h1>Регистрация</h1>
        <p>Привет, дорогой посетитель! Ваш заказ почти у Вас, осталось совсем чуть-чуть! Заполните еще некоторые данные</p>
      </div>
      <div 
        class="step1" 
        v-if="currentStep==1"
      >

        <label>
          {{ formData.firstName.label }}: 
          <input 
            type="text" 
            v-model="formData.firstName.value" 
            @blur="$v.formData.firstName.value.$touch()" 
            :class="{'is-invalid': $v.formData.firstName.value.$error}"
          >
          <div 
            class="error" 
            v-if="!$v.formData.firstName.value.required">Обязательно для заполнения
          </div>
        </label>

        <label>
          {{ formData.lastName.label }}: 
          <input 
            type="text" 
            v-model="formData.lastName.value" 
            @blur="$v.formData.lastName.value.$touch()" 
            :class="{'is-invalid': $v.formData.lastName.value.$error}"
          >
          <div 
            class="error" 
            v-if="!$v.formData.lastName.value.required">Обязательно для заполнения
          </div>
        </label>

        <label>
          {{ formData.patronymic.label }}: 
          <input 
            type="text" 
            v-model="formData.patronymic.value"
          >
        </label>

        <label>
          {{ formData.phoneNumber.label }}: 
          <input 
            type="text" 
            v-model="formData.phoneNumber.value" 
            @blur="$v.formData.phoneNumber.value.$touch()" 
            :class="{'is-invalid': $v.formData.phoneNumber.value.$error}" 
            v-mask="'+7(999)999-99-99'"
          >
          <div 
            class="error" 
            v-if="!$v.formData.phoneNumber.value.required">Обязательно для заполнения
          </div>
        </label>
       
        <label>
          {{ formData.email.label }}: 
          <input 
            type="text" 
            v-model="formData.email.value" 
            @blur="$v.formData.email.value.$touch()" 
            :class="{'is-invalid': $v.formData.email.value.$error}"
          >
          <div 
            class="error" 
            v-if="!$v.formData.email.value.required">Обязательно для заполнения
          </div>
          <div 
            class="error" 
            v-if="!$v.formData.email.value.email">Неверно введен e-mail
          </div>
        </label>

      </div>
      

      <div 
        class="step2" 
        v-if="currentStep==2"
      >
        <label>Укажите дату Вашего рождения:
          <input 
            type="date" 
            v-model="formData.birthDate.value" 
            @blur="$v.getUserAge.$touch()" 
            :class="{'is-invalid': $v.getUserAge.$error}"
          >
          <div 
            class="error" 
            v-if="!$v.getUserAge.$model">Укажите дату рождения
          </div>
          <div 
            class="error" 
            v-if="!$v.getUserAge.minValue && $v.getUserAge.$dirty">Похоже, что Вам меньше 18 лет. Попробуйте через {{ 18 - getUserAge }} лет
          </div>
        </label>
        <div 
          class="fileAttach"
        >
          <p>Загрузите Ваше фото в формате .png или .jpeg</p>
          <input 
            type="file" 
            accept=".png, .jpeg"
          >
        </div>
        <hr>
      </div>

      <div 
        class="step3" 
        v-if="currentStep==3"
      >
        <p>Итак, подведем итоги:</p>
        <div 
          class="render_form-data"
        >
            <p 
              v-for="(i) in formData">{{i.label}} : {{i.value}}</p>
        </div>
      </div>
  
      <div 
        class="step4" 
        v-if="currentStep==4"
      >
        <h2>Успешно!</h2>
        <p>Ваш заказ уже спешитт к Вам, а специалисты нашей компании набирают Ваш номер и пишут Вам письменное уведомление с деталями заказа!)</p>
      </div>

      <div 
        class="progress_bar"
      >
        <div 
          v-bind:style="{width:progressBar + '%'}">
        </div>
      </div>
      <div 
        class="buttons"
      >
        <button 
          v-on:click="(currentStep==steps.length) ? restartApp() : currentStep--" 
          v-if="currentStep>1" 
          class="prevButton">{{ (currentStep == steps.length) ? "Заново" : "Назад" }}
        </button>
        <button 
          v-on:click="(currentStep == steps.length-1) ? sendForm() : currentStep++" 
          v-if="currentStep < steps.length" 
          class="nextButton">{{ (currentStep == steps.length-1) ? "Готово" : "Далее" }}
        </button>
      </div>
    </div> 

    <div 
      class="popup-error" 
      v-if="showErrorPopup" 
      @click="showErrorPopup = !showErrorPopup"
    >
      <div 
        class="popup-error__body"
      >
          <p>Похоже, вы что то забыли заполнить! Вернитесь назад</p>
          <button>Назад к форме</button>
      </div>
    </div>

  </div>
</template>

<script>
import { required, email, minValue } from 'vuelidate/lib/validators'

export default {
  data () {
    return {
      currentStep: 1,
      formData:{
        firstName: {
          label: "Имя",
          value: ""
        },
        lastName: {
          label: "Фамилия",
          value: ""
        },
        patronymic: {
          label: "Отчество",
          value: ""
        },
        phoneNumber: {
          label: "Мобильный телефон",
          value: ""
        },
        birthDate: {
          label: "Дата рождения",
          value: ""
        },
        email: {
          label: "Электронная почта",
          value: ""
        }
      },
      // formData:{
      //   firstName: '',
      //   lastName: '',
      //   patronymic: '',
      //   phoneNumber: '',
      //   birthDate: '',
      //   email: ''
      // },
      steps: [
        "Entering FIO",
        "Birth date and photo",
        "summary info",
        "submit popup"
      ],
      showErrorPopup: false
    }
  },
  validations: {
    getUserAge:{
      minValue: minValue(18)
    },
    formData:{
      email:{
        value: {
          required,
          email
        }
      },
      firstName:{
        value: {
          required
        }
      },
      lastName:{
        value: {
          required
        }
      },
      phoneNumber:{
        value: {
          required
        }
      }
    }
   
  },
  computed:{
    progressBar(){ //defines progress-bar div width;
      return 100/(this.steps.length/this.currentStep);
    },
    getUserAge(){ //calc user age;
      var birthValue = new Date(this.formData.birthDate.value);
      var age = Math.abs(
        new Date(Date.now() - birthValue).getUTCFullYear() - 1970
      );
      return age;
    }
  },
  methods:{
    sendForm(){
      if(this.$v.$invalid){
        this.showErrorPopup = true;
      }
      else{
        this.currentStep++;        
      }
    },
    restartApp(){
      location.reload();
    }
  }
}
</script>

<style lang="scss">
  #form{
    max-width: 640px;
    margin: 0 auto;
    /* display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: space-between; */
    .intro{
      h1{
        text-align: center;
        font-size: 1.875rem;
        font-weight: 500;
        color: #2d3336;
      }
      p{
        margin: 30px auto;
        font-weight: 300;
        font-size: 1.5rem;
        text-align: center;
        letter-spacing: 0;
        max-width: 500px;
        color: #5c6162; 
      }
    }
    .buttons{
      display: flex;
      justify-content: flex-end;
      flex-wrap: nowrap;
      button{
        display: inline-block;
        outline: none;
        color: #09848d;
        padding: .75rem 1.5rem;
        text-decoration: none;
        border-radius: .25rem;
        text-transform: uppercase;
        font-weight: 500;
        font-size: .875rem;
        position: relative;
        border-width: 2px;
        border-color: #09848d;
        letter-spacing: .2;
        -webkit-transition: all .3s ease;
        transition: all .3s ease;
      }
      .nextButton{
        color: #fff;
        background-color: #09848d;
        margin-left: 12px;
      }
    }
    .progress_bar{
      background-color: #c6c6c6;
      border-radius: 10px;
      height: 14px;
      width: 90%;
      margin: 30px auto 20px;
      div{
        background-color: #09848d;
        height: 100%;
        border-radius: 10px;
        transition: all .3s ease;
      }
    }
  }

  .step1{
    margin-top: 40px;
    padding: 0 40px;
    label{
      color: #5c6162;
      display: block;
      margin-bottom: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      white-space: nowrap;
      position: relative;
      input{
        width: 100%;
        margin-left: 35px;
        background-color: #f4f7f7;
        border-radius: 5px;
        outline: none;
        border: none;
        height: 25px;
        padding: 8px 12px;
        font-size: 16px;
        box-sizing: border-box;
        height: 42px;
      }
    }
  }

  .step2{
    padding: 0 40px;
    label{
      color: #5c6162;
      display: block;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      white-space: nowrap;
      position: relative;
      input{
        width: 100%;
        margin-left: 35px;
        background-color: #f4f7f7;
        border-radius: 5px;
        outline: none;
        border: none;
        height: 25px;
        padding: 8px 12px;
        font-size: 16px;
        box-sizing: border-box;
        height: 42px;
      }
    }
    .fileAttach{
      margin-top: 30px;
      p{
        color: #5c6162;
      }
      input{
        margin-top: 10px;
      }
    }
  }

  .step3{
    padding: 0 40px;
    p{
      margin-bottom: 10px;
    }
    >p:first-child{
      text-align: center;
      font-size: 1.875rem;
      font-weight: 500;
      color: #2d3336;
    }
    .render_form-data{
      margin-top: 40px;
      border: 2px solid #666161;
      padding: 30px;
      border-radius: 15px;
    }
  }

  .step4{
    h2{
      text-align: center;
      font-size: 1.875rem;
      font-weight: 500;
      color: #2d3336;
    }
    p{
      margin: 30px auto 50px;
      font-weight: 300;
      font-size: 1.5rem;
      text-align: center;
      letter-spacing: 0;
      max-width: 500px;
      color: #5c6162;
    }
  }
</style>
