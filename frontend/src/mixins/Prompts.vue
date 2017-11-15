<script>
export default{
  props: ['title', 'show', 'submitText'],
  data () {
    return {
      loading: false,
      loadingText: ''
    }
  },
  methods: {
    closeParent () {
      this.$emit('show', false)
    },
    showLoading (text) {
      if (text !== '') {
        this.loadingText = text
      }
      this.loading = true
    },
    stopLoading () {
      this.loadingText = ''
      this.loading = false
    },
    emitUpdate () {
      this.$emit('updated')
    }
  },
  computed: {
    toggle: {
      set (val) {
        this.$emit('update:show', val)
      },
      get () {
        return this.show
      }
    }
  }
}
</script>