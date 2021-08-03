<template>
  <div class="category-content">
    <div class="row">
      <div class="col-12 col-sm-5">
        <div class="d-flex justify-content-center mt-3">
          <div class="form">
            <p class="category--add">
              Thêm {{ getTitle }} 
            </p>
            <p class="error">{{errs.item}}</p>
            <div class="form-control">
              <input
                type="text"
                class="input"
                v-model="addValue"
                placeholder="Thêm mới"
              />
              <div class="btn" @click="handleAddItem">Thêm mới</div>
            </div>
          </div>
        </div>
        <div class="d-flex justify-content-center">
          <div class="form" v-show="changeName">
            <p class="category--add">
              Sửa tên {{ changeItem.name }}
              <span @click="changeName = !changeName">x</span>
            </p>
            <p class="error">{{errs.itemChange}}</p>
            <div class="form-control">
              <input type="text" class="input" v-model="newName" />
              <div class="btn" @click="handleChangeItem">Lưu</div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-7">
        <p class="category--title">Danh sách {{ getTitle }}</p>
        <div
          class="list"
          v-for="item in listItem"
          :key="item.id"
          :data-id="item.id"
        >
          <span class="item--name">
            {{ item.name }}
          </span>
          <div class="item--btn" @click="openChangeForm">Thay đổi</div>
          <div class="item--btn item--delete" @click="handleDeleteItem">
            Xóa
          </div>
        </div>
      </div>
    </div>
    <success :content="success" v-if="success"/>
    <error :content="err" v-if="err" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Error from '../Message/Error.vue';
import Success from '../Message/Success.vue'
export default {
  name: "ManageContent",
  components:{ Success, Error, },
  data() {
    return {
      changeName: false,
      changeItem: { name: null, id: null },
      newName: "",
      addValue: "",
      err:null,
      success: null,
      errs:{
        item: null,
        itemChange: null
      }
    };
  },
  props: ["title"],
  computed: {
    ...mapGetters(["airlines", "seats", "locations"]),
    getTitle() {
      if (this.title === "airlines") {
        return "hãng máy bay";
      } else if (this.title === "locations") {
        return "địa điểm";
      } else {
        return "loại ghế";
      }
    },
    listItem() {
      return this[this.title];
    },
  },
  methods: {
    ...mapActions(["addCategory", "deleteCategory", "changeCategory"]),
    async handleAddItem() {
      if(!this.addValue){
        this.errs.item="Không được để trống"
        return
      }
      this.errs.item= null
      const res = await this.addCategory({
        link: this.title,
        data: { name: this.addValue },
      });
      if (res.err) {
        this.err= res.err
        setTimeout(()=>{
          this.err= null
        },8000)
      } else {
        this.addValue = "";
        this.success= res.message
        setTimeout(()=>{
          this.success= null
        },8000)
      }
    },
    async handleDeleteItem(e) {
      const id = e.target.parentNode.dataset.id;
      if (id === this.changeItem.id) {
        this.changeName = false;
      }
      const res = await this.deleteCategory({
        link: this.title,
        id,
      });
      console.log(res);
      if(res.err){
        this.err= "Không thể xóa vì đã có dữ liệu liên kết"
        setTimeout(()=>{
          this.err= null
        },8000)
      }else{
        this.success= res.message
        setTimeout(()=>{
          this.success= null
        },8000)
      }
    },
    openChangeForm(e) {
      const el = e.target.parentNode;
      const id = el.dataset.id;
      const name = el.firstChild.textContent;
      this.changeName = true;
      this.changeItem = { id, name };
      this.newName = "";
    },
    async handleChangeItem() {
      const { id } = this.changeItem;
      const name = this.newName;
      if(!name){
        this.errs.itemChange= "Không được để trống"
        return
      }
      this.errs.itemChange= null
      const res = await this.changeCategory({
        link: this.title,
        id,
        name,
      });
      if (res.err) {
        this.err= res.err
        setTimeout(()=>{
          this.err= null
        },8000)
      } else {
        this.changeItem.name = name;
        this.newName = "";
        this.success= res.message
        setTimeout(()=>{
          this.success= null
        },8000)
      }
    },
  },
};
</script>

<style scoped>
.error{
  color: red;
  padding-bottom: 8px;
}
.category--add {
  font-size: 16px;
  padding: 12px 0;
  display: flex;
  justify-content: space-between;
  /* background: #fff; */
}
.form {
  border: 1px solid #ccc;
  padding: 0 10px 10px 10px;
  box-shadow: 1px 1px 4px #ccc;
  margin-bottom: 20px;
  width: 100%;
  max-width: 350px;
  background: #fff;
}
.category--add span {
  color: red;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.category--add span:hover {
  cursor: pointer;
  background: red;
  color: #fff;
}
.form-control {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  overflow: hidden;
}
.input {
  border: 1px solid #ccc;
  flex-basis: 100%;
  padding: 6px 8px;
  border-radius: 3px;
  outline: none;
}
.input:focus {
  border-color: blue;
}
.btn {
  margin: 12px auto;
  padding: 6px 12px;
  color: #fff;
  background: blue;
  text-align: center;
  opacity: 0.7;
  border-radius: 6px;
  transition: opacity 0.3s linear;
}
.btn:hover {
  opacity: 0.9;
  cursor: pointer;
}
.category--title {
  padding: 0 0 12px;
  font-size: 16px;
  text-align: center;
  font-weight: 400;
}
.list {
  display: flex;
  padding: 6px 8px;
  box-shadow: 0px 1px 4px #ccc;
  margin-bottom: 2px;
  background: #fff;
}
.item--name {
  flex-grow: 1;
}
.item--btn {
  color: blue;
  text-decoration: underline;
  padding: 0 6px;
  opacity: 0.7;
  transition: opacity 0.3s linear;
}
.item--btn:hover {
  cursor: pointer;
  opacity: 1;
}
.item--delete {
  color: red;
}
</style>