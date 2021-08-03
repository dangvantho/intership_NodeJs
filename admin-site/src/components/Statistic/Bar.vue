<script>
import { Bar } from "vue-chartjs";

export default {
  extends: Bar,
  // mixins: [mixins.reactiveProp, mixins.reactiveData],
  props: ["chartdata"],
  data() {
    return {
      options: {
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
          mode: "index",
          intersect: false,
        },
        hover: {
          mode: "nearest",
          intersect: true,
        },
        scales: {
          xAxes: [
            {
              display: true,
              categoryPercentage: 0.5,
            },
          ],
          yAxes: [
            {
              display: true,
              scaleLabel: {
                display: true,
                labelString: "Số lượng vé",
                color: "#911",
              },
            },
          ],
        },
      },
    };
  },
  mounted() {
    this.renderChart(this.chartdata, this.options);
  },
};
</script>

<style>
</style>