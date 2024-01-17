<template>
  <i-frame :src="url" />
</template>
<script>
import iFrame from "@/components/iFrame/index";
export default {
  name: "Swagger",
  components: { iFrame },
  data() {
    return {
      // url: new URL(process.env.VUE_APP_BASE_API).origin + "/docs"
      url: new URL(process.env.VUE_APP_BASE_API).origin
    };
  },
};
</script>
