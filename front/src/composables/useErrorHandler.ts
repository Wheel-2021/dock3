

export default function useErrorHandler(
  errors: ComputedRef<Partial<Record<string, string | undefined>>>
) {
  return () => {
    const firstError = Object.keys(errors.value)[0];
    const errorElem = document.querySelector<HTMLElement>(
      `[name="${firstError}"]`
    );
    if (errorElem) {
      const errorElemOffsetTop = errorElem.offsetTop;
      window.scrollTo({
        top: errorElemOffsetTop,
        behavior: 'smooth',
      });
      errorElem.focus();
    }
  };
}
