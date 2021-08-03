<template>
  <div class="category">
    <div class="container">
      <div class="row">
        <div class="col">
          <div class="d-flex justify-content-center">
            <div
              :class="{ 'category-header': true, active: currentTab.airlines }"
              @click="() => handleClickTab('airlines')"
            >
              Hãng máy bay
            </div>
            <div
              :class="{ 'category-header': true, active: currentTab.locations }"
              @click="() => handleClickTab('locations')"
            >
              Địa điểm
            </div>
            <div
              :class="{ 'category-header': true, active: currentTab.seats }"
              @click="() => handleClickTab('seats')"
            >
              Loại ghế
            </div>
          </div>
        </div>
      </div>
      <ManageCOntent :title="'airlines'" v-show="currentTab.airlines" />
      <ManageCOntent :title="'seats'" v-show="currentTab.seats" />
      <ManageCOntent :title="'locations'" v-show="currentTab.locations" />
    </div>
    <loading/>
  </div>
</template>

<script>
import Loading from '../../../../client/src/components/Loading.vue';
import ManageCOntent from "./ManageContent";
export default {
  name: "ManageCategory",
  components: { ManageCOntent, Loading },
  data() {
    return {
      currentTab: {
        airlines: true,
        seats: false,
        locations: false,
      },
    };
  },
  methods: {
    handleClickTab(tab) {
      for (let value in this.currentTab) {
        this.currentTab[value] = false;
      }
      this.currentTab[tab] = true;
    },
  },
};
</script>

<style scoped>
.category {
  padding: 30px 0;
  min-height: 700px;
  background: #f7f7f8;
  position: relative;
}
.category-header {
  padding: 4px 12px;
  margin-right: 4px;
  margin-bottom: 20px;
  border-radius: 4px;
  background: rgb(241, 239, 239);
  font-size: 16px;
  transition: all 0.3s linear;
  font-weight: 500;
}
.category-header:hover {
  background: rgb(12, 127, 221);
  color: #fff;
  cursor: pointer;
}
.active {
  background: rgb(12, 127, 221);
  color: #fff;
}
</style>