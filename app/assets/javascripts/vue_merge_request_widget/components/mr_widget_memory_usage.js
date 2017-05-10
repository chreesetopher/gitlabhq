import statusCodes from '~/lib/utils/http_status';
import MemoryGraph from '../../vue_shared/components/memory_graph';
import MRWidgetService from '../services/mr_widget_service';

export default {
  name: 'MemoryUsage',
  props: {
<<<<<<< HEAD
    mr: { type: Object, required: true },
    service: { type: Object, required: true },
=======
>>>>>>> upstream/master
    metricsUrl: { type: String, required: true },
  },
  data() {
    return {
      // memoryFrom: 0,
      // memoryTo: 0,
      memoryMetrics: [],
<<<<<<< HEAD
=======
      deploymentTime: 0,
>>>>>>> upstream/master
      hasMetrics: false,
      loadFailed: false,
      loadingMetrics: true,
      backOffRequestCounter: 0,
    };
  },
  components: {
    'mr-memory-graph': MemoryGraph,
  },
<<<<<<< HEAD
  methods: {
    computeGraphData(metrics) {
=======
  computed: {
    shouldShowLoading() {
      return this.loadingMetrics && !this.hasMetrics && !this.loadFailed;
    },
    shouldShowMemoryGraph() {
      return !this.loadingMetrics && this.hasMetrics && !this.loadFailed;
    },
    shouldShowLoadFailure() {
      return !this.loadingMetrics && !this.hasMetrics && this.loadFailed;
    },
    shouldShowMetricsUnavailable() {
      return !this.loadingMetrics && !this.hasMetrics && !this.loadFailed;
    },
  },
  methods: {
    computeGraphData(metrics, deploymentTime) {
>>>>>>> upstream/master
      this.loadingMetrics = false;
      const { memory_values } = metrics;
      // if (memory_previous.length > 0) {
      //   this.memoryFrom = Number(memory_previous[0].value[1]).toFixed(2);
      // }
      //
      // if (memory_current.length > 0) {
      //   this.memoryTo = Number(memory_current[0].value[1]).toFixed(2);
      // }

      if (memory_values.length > 0) {
        this.hasMetrics = true;
        this.memoryMetrics = memory_values[0].values;
<<<<<<< HEAD
      }
    },
  },
  mounted() {
    this.$props.loadingMetrics = true;
    gl.utils.backOff((next, stop) => {
      MRWidgetService.fetchMetrics(this.$props.metricsUrl)
        .then((res) => {
          if (res.status === statusCodes.NO_CONTENT) {
            this.backOffRequestCounter = this.backOffRequestCounter += 1;
            if (this.backOffRequestCounter < 3) {
              next();
            } else {
              stop(res);
            }
          } else {
            stop(res);
          }
        })
        .catch(stop);
    })
    .then((res) => {
      if (res.status === statusCodes.NO_CONTENT) {
        return res;
      }

      return res.json();
    })
    .then((res) => {
      this.computeGraphData(res.metrics);
      return res;
    })
    .catch(() => {
      this.$props.loadFailed = true;
    });
  },
  template: `
    <div class="mr-info-list mr-memory-usage">
      <div class="legend"></div>
      <p
        v-if="loadingMetrics"
        class="usage-info usage-info-loading">
=======
        this.deploymentTime = deploymentTime;
      }
    },
    loadMetrics() {
      gl.utils.backOff((next, stop) => {
        MRWidgetService.fetchMetrics(this.metricsUrl)
          .then((res) => {
            if (res.status === statusCodes.NO_CONTENT) {
              this.backOffRequestCounter = this.backOffRequestCounter += 1;
              /* eslint-disable no-unused-expressions */
              this.backOffRequestCounter < 3 ? next() : stop(res);
            } else {
              stop(res);
            }
          })
          .catch(stop);
      })
        .then((res) => {
          if (res.status === statusCodes.NO_CONTENT) {
            return res;
          }

          return res.json();
        })
        .then((res) => {
          this.computeGraphData(res.metrics, res.deployment_time);
          return res;
        })
        .catch(() => {
          this.loadFailed = true;
          this.loadingMetrics = false;
        });
    },
  },
  mounted() {
    this.loadingMetrics = true;
    this.loadMetrics();
  },
  template: `
    <div class="mr-info-list clearfix mr-memory-usage js-mr-memory-usage">
      <div class="legend"></div>
      <p
        v-if="shouldShowLoading"
        class="usage-info js-usage-info usage-info-loading">
>>>>>>> upstream/master
        <i
          class="fa fa-spinner fa-spin usage-info-load-spinner"
          aria-hidden="true" />Loading deployment statistics.
      </p>
      <p
<<<<<<< HEAD
        v-if="!hasMetrics && !loadingMetrics"
        class="usage-info usage-info-loading">
        Deployment statistics are not available currently.
      </p>
      <p
        v-if="hasMetrics"
        class="usage-info">
        Deployment memory usage:
      </p>
      <p
        v-if="loadFailed"
        class="usage-info">
        Failed to load deployment statistics.
      </p>
      <mr-memory-graph
        v-if="hasMetrics"
        :metrics="memoryMetrics"
=======
        v-if="shouldShowMemoryGraph"
        class="usage-info js-usage-info">
        Deployment memory usage:
      </p>
      <p
        v-if="shouldShowLoadFailure"
        class="usage-info js-usage-info usage-info-failed">
        Failed to load deployment statistics.
      </p>
      <p
        v-if="shouldShowMetricsUnavailable"
        class="usage-info js-usage-info usage-info-unavailable">
        Deployment statistics are not available currently.
      </p>
      <mr-memory-graph
        v-if="shouldShowMemoryGraph"
        :metrics="memoryMetrics"
        :deploymentTime="deploymentTime"
>>>>>>> upstream/master
        height="25"
        width="100" />
    </div>
  `,
};
