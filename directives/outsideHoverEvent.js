export default {
    beforeMount: (el, binding) => {
      el.hoverOutsideEvent = event => {
        if (!(el == event.target || el.contains(event.target))) {
          binding.value();
        }
      };
      document.addEventListener("mouseover", el.hoverOutsideEvent);
    },
    unmounted(el) {
      document.removeEventListener('mouseover', el.hoverOutsideEvent);
    }
};
