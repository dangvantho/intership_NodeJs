<template>
  <div class="home">
    <div class="banner">
      <div v-for="(banner, index) in banners" :key="index">
        <img
          :src="banner"
          alt="Banner"
          class="slide"
          v-show="index === slide"
        />
      </div>
      <div class="find-ticket d-none d-sm-block">
        <h2 class="title">Vé máy bay</h2>
        <form class="form">
          <div class="form-input">
            <label for="_from" class="form-label"> Điểm đi </label>
            <input
              type="text"
              placeholder="Điểm đi"
              v-model="from.value"
              class="form-control"
              @click="toggleFrom"
            />
            <span class="error">{{ from.err }}</span>
            <ul class="options" v-show="from.open">
              <li
                class="option"
                v-for="location in locations"
                :key="location.id"
                @click="chooseFrom"
                :data-id="location.id"
              >
                {{ location.name }}
              </li>
            </ul>
          </div>
          <div class="form-input">
            <label for="_from" class="form-label"> Điểm đến </label>
            <input
              type="text"
              placeholder="Điểm đến"
              v-model="to.value"
              class="form-control"
              @click="toggleTo"
            />
            <span class="error">{{ to.err }}</span>
            <ul class="options" v-show="to.open">
              <li
                class="option"
                v-for="location in locations"
                :key="location.id"
                @click="chooseTo"
                :data-id="location.id"
              >
                {{ location.name }}
              </li>
            </ul>
          </div>
          <div class="form-input">
            <label for="_from" class="form-label"> Ngày đi </label>
            <date-picker
              v-model="time"
              valueType="format"
              :format="format"
              style="width: 190px"
            ></date-picker>
            <!-- <input type='date' placeholder="Điểm đi" name="_from"> -->
          </div>
          <button class="search" to="/search" @click="search">Tìm kiếm</button>
        </form>
      </div>
    </div>
    <section class="container mt-2 mb-3">
      <div class="row">
        <div
          class="col-12 col-md-3 text-center"
          v-for="coreValue in coreValues"
          :key="coreValue.title"
        >
          <img :src="coreValue.img" class="core-img" />
          <h3 class="core-title">{{ coreValue.title }}</h3>
          <p class="core-text">{{ coreValue.text }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import banner1 from "../../assets/banner1.png";
import banner2 from "../../assets/banner2.png";
import banner3 from "../../assets/banner3.png";
import banner4 from "../../assets/banner4.png";
import ck1 from "../../assets/ck1.png";
import ck2 from "../../assets/ck2.png";
import ck3 from "../../assets/ck3.png";
import ck4 from "../../assets/ck4.png";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import { mapGetters, mapMutations } from "vuex";
import helper from '../Helper/Helper'
export default {
  name: "Home",
  components: { DatePicker },
  data() {
    return {
      slide: 0,
      banners: [banner1, banner2, banner3, banner4],
      interval: null,
      time: "",
      format: "DD/MM/YYYY",
      from: { open: false, value: "", err: "" },
      to: { open: false, value: "", err: "" },
      form: {
        _from: null,
        _to: null,
        _time: null,
      },
      coreValues: [
        {
          img: ck1,
          title: "GIÁ RẺ NHẤT",
          text: "Cam kết tìm kiếm và bán vé rẻ nhất thị trường",
        },
        {
          img: ck2,
          title: "UY TÍN NHẤT",
          text: "Cam kết tìm kiếm và bán vé rẻ nhất thị trường",
        },
        {
          img: ck3,
          title: "NHIỆT TÌNH NHẤT",
          text: "Cam kết tìm kiếm và bán vé rẻ nhất thị trường",
        },
        {
          img: ck4,
          title: "GIAO VÉ TẬN NƠI",
          text: "Cam kết tìm kiếm và bán vé rẻ nhất thị trường",
        },
      ],
    };
  },
  mounted() {
    this.bannerSlide();
    // this.setTime()
  },
  destroyed() {
    this.clearSlide();
  },
  computed: {
    ...mapGetters(["locations",'query']),
  },
  methods: {
    ...mapMutations([ "SET_QUERY"]),
    bannerSlide() {
      let index = 0;
      this.interval = setInterval(() => {
        index++;
        if (index !== 4) {
          this.slide = index;
        } else {
          index = 0;
          this.slide = 0;
        }
      }, 3000);
    },
    clearSlide() {
      clearInterval(this.interval);
    },
    chooseFrom(e) {
      const id = e.target.dataset.id;
      const value = e.target.textContent;
      if (value === this.to.value) {
        this.from.err = "Địa điểm đến giống địa điểm đi";
      } else {
        this.to.err = "";
        this.from.err = "";
      }
      this.form._from = id;
      console.log(this.form, this.from);
      this.from.value = value;
      this.close();
    },
    chooseTo(e) {
      const id = e.target.dataset.id;
      const value = e.target.textContent;
      if (value === this.from.value) {
        this.to.err = "Địa điểm đến giống địa điểm đi";
      } else {
        this.from.err = "";
        this.to.err = "";
      }
      this.form._to = id;
      console.log(this.form, this.from);
      this.to.value = value;
      this.close();
    },
    close() {
      this.from.open = false;
      this.to.open = false;
    },
    toggleFrom() {
      this.from.open = !this.from.open;
      this.to.open = false;
    },
    toggleTo() {
      this.from.open = false;
      this.to.open = !this.to.open;
    },
    async search(e) {
      e.preventDefault();
      if (this.form._from === this.form._to && this.form._from) {
        return;
      }
      if (!this.form._time) {
        const today = new Date(Date.now());
        const day = helper.getDayString(today);
        const weekday = today.getDay();
        this.SET_QUERY({
          day,
          weekday,
          _from: this.form._from,
          _to: this.form._to
        });
      }else{
        this.SET_QUERY({
          _from: this.form._from,
          _to: this.form._to,
          day: this.form._time,
          weekday: helper.getDayTime(this.form._time).getDay()
        })
      }
      await this.$store.dispatch("searchflights", this.query);
      this.$router.push("search-ticket");
    },
  },
  watch: {
    time(newValue) {
      this.form._time = newValue;
    },
  },
};
</script>

<style scoped>
.home {
  position: relative;
}
.banner {
  position: relative;
  overflow-x: hidden;
}
.slide {
  width: 100%;
  height: 420px;
  object-fit: cover;
  object-position: center;
  animation: add-item 0.9s linear;
}
.find-ticket {
  max-width: 400px;
  position: absolute;
  top: 50%;
  left: 50px;
  transform: translate(0, -50%);
}
.title {
  font-weight: 600;
  color: #fff;
  background: #00aeef;
  border-radius: 10px 10px 0 0;
  padding: 6px 16px;
  display: inline-block;
  border: none;
}
.form {
  min-width: 450px;
  max-width: 500px;
  background: #00aeef;
  display: flex;
  flex-wrap: wrap;
  padding: 15px;
  border: none;
  border-radius: 0 10px 10px 10px;
}
.form-input {
  width: 192px;
  margin-right: 12px;
  margin-bottom: 8px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.4);
  position: relative;
  border: none;
}
.form-label {
  display: block;
  margin-bottom: 8px;
  color: #fff;
  text-transform: uppercase;
}
.form-control {
  display: inline-block;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 100%;
  height: 34px;
  padding: 6px 30px;
  padding-left: 10px;
  font-size: 14px;
  line-height: 1.4;
  color: #555;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
}
.form-control:hover {
  border: 1px solid #409aff;
  cursor: pointer;
}
.search {
  width: 100%;
  background: #ef8700;
  color: #fff;
  font-weight: 600;
  font-size: 18px;
  cursor: pointer;
  margin: 10px 120px;
  padding: 8px 0;
  border: none;
  outline: none;
  border-radius: 6px;
}
.options {
  position: absolute;
  list-style: none;
  background: #fff;
  /* display: block; */
  width: 100%;
  z-index: 9;
}
.option {
  padding: 6px 15px;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
}
.error {
  color: red;
  font-weight: 500;
}
.close {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: #ccc;
  opacity: 0;
  z-index: 1;
}
.core-title {
  margin: 8px auto;
  text-align: center;
}
.core-text {
  margin: 8px auto;
  text-align: center;
}
.core-img {
  width: 96px;
  height: 74px;
  display: flex;
  margin: 16px auto;
}
@keyframes add-item {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
</style>
