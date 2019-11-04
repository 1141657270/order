<template>
  <div ref="editor" class="editor"></div>
</template>

<script>
import E from "wangeditor";
export default {
  props: ["value"],
  data() {
    return {
      text: this.value
    };
  },
  mounted() {
    this.editor = new E(this.$refs.editor);
    this.editor.customConfig.onchange = html => {
      this.text = html;
    };
    this.editor.create();
  },
  watch: {
    value: function(value) {
      this.$nextTick(() => {
        if (this.editor.txt.html() != value) {
          this.editor.txt.html(value);
        }
      });
    },
    text: function(value) {
      this.$emit("input", value);
    }
  }
};
</script>
<style >
.w-e-toolbar{
    display: block;
}
.w-e-menu{
    display: inline-block;
}


.w-e-text-container{
    height:300px!important;
}

</style>