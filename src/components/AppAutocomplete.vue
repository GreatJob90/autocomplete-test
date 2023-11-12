<template>
    <div class="autocomplete">
        <div class="autocomplete__input-wrapper">
            <div class="autocomplete__input-inner">
                <input
                    ref="input"
                    v-model="_searchValue"
                    class="autocomplete__input-field"
                    type="text"
                    autocomplete="off"
                    placeholder="Search for GitHub user"
                    @keydown.enter="selectValue(_searchValue)"
                    @keydown.arrow-down="focusOptionByArrowKeys(0)">
                <span class="autocomplete__input-spinner">
                    <transition name="fade">
                        <SpinnerIcon v-show="isLoading" />
                    </transition>
                </span>
                <span
                    @click="toggleOptionsList"
                    class="autocomplete__input-arrow"
                    :class="{ 'is-active': isOptionsActive }">
                    <ChevronIcon />
                </span>
            </div>
        </div>
        <transition name="fade">
            <div
                v-show="isOptionsActive"
                class="autocomplete__options-wrapper">
                <div class="autocomplete__options-inner">
                    <div class="autocomplete__options">
                        <template v-if="hasOptions">
                            <div
                                :key="index"
                                :tabindex="index"
                                v-for="(option, index) in options"
                                :ref="setOptionRef"
                                class="autocomplete__options-item"
                                @click="selectValue(option.label)"
                                @keydown.enter="selectValue(option.label)"
                                @keydown.arrow-up="focusOptionByArrowKeys(index - 1)"
                                @keydown.arrow-down="focusOptionByArrowKeys(index + 1)">
                                {{ option.label }}
                            </div>
                        </template>
                        <div
                            v-if="!hasOptions && isLoading"
                            class="autocomplete__options-placeholder">
                            Loading...
                        </div>
                        <div
                            v-if="!hasOptions && !isLoading"
                            class="autocomplete__options-placeholder">
                            Nothing to select
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    import ChevronIcon from "@/components/Icons/ChevronIcon.vue";
    import SpinnerIcon from "@/components/Icons/SpinnerIcon.vue";

    export default {
      name: "AppAutocomplete",

      components: {
        SpinnerIcon,
        ChevronIcon
      },

      props: {
        searchValue: {
          type: String,
          default: null
        },

        options: {
          type: Array,
          default: () => []
        },

        isLoading: {
          type: Boolean,
          default: false
        }
      },

      data: () => {
        return {
          isOptionsActive: false,
          optionsRefs: []
        };
      },

      computed: {
        _searchValue: {
          get () {
            return this.searchValue;
          },

          set (value) {
            this.$emit("input-search-value", value);
          }
        },

        hasOptions () {
          return this.options?.length > 0;
        }
      },

      methods: {
        setOptionsListActive (isActive) {
          this.isOptionsActive = isActive;
        },

        toggleOptionsList () {
          this.isOptionsActive = !this.isOptionsActive;
        },

        setOptionRef(optionEl) {
          if (optionEl) {
            this.optionsRefs.push(optionEl);
          }
        },

        focusOptionByArrowKeys (index) {
          const isOptionsActiveAndNotEmpty = this.isOptionsActive && this.hasOptions;

          if (isOptionsActiveAndNotEmpty && this.optionsRefs[index]) {
            this.optionsRefs[index].focus();
          } else if (isOptionsActiveAndNotEmpty && index === -1) {
            this.$refs.input.focus();
          }
        },

        selectValue (value) {
          this.$emit("select-value", value);
          this.setOptionsListActive(false);
          this.$refs.input.focus();
        },

        emptyOptionsRefs () {
          this.optionsRefs = [];
        }
      },

      watch: {
        options: {
          handler () {
            const isOptionsListNotEmpty = this.hasOptions;

            this.setOptionsListActive(isOptionsListNotEmpty);
          }
        }
      },

      beforeUpdate() {
        this.emptyOptionsRefs();
      },
    };
</script>

<style lang="scss" scoped>
.autocomplete {
  position: relative;
  width: 260px;

  &__input-wrapper {
    position: relative;
    z-index: 2;
    height: 32px;
    background: linear-gradient(90.87deg, #FFC700 0%, #A5E870 100%);
    border-radius: 4px;
    padding: 1px;
  }

  &__input-inner {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    height: 100%;
    background: #FFFFFF;
    border-radius: 4px;
    padding: 2px 7px;
  }

  &__input-field {
    width: 100%;

    &::placeholder {
      opacity: 0.5;
      font-size: 0.9em;
    }
  }

  &__input-arrow,
  &__input-spinner {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    user-select: none;
  }

  &__input-arrow {
    cursor: pointer;
    transition: .3s;

    &.is-active {
      transform: scale3d(1, -1, 1);
    }
  }

  &__options-wrapper {
    position: absolute;
    z-index: 1;
    left: 0;
    top: 30px;
    right: 0;
    bottom: 0;
  }

  &__options-inner {
    border-radius: 0 0 4px 4px;
    padding: 1px;
    background: linear-gradient(90.87deg, #FFC700 0%, #A5E870 100%);
  }

  &__options {
    width: 100%;
    background: #FFFFFF;
    border-radius: 0 0 4px 4px;
    padding: 2px 0 0;
  }

  &__options-item {
    padding: 2px 7px;
    cursor: pointer;
    transition: .3s;

    &:hover,
    &:focus {
      background: transparentize(#FFC904, .83);
    }
  }

  &__options-placeholder {
    text-align: center;
    padding: 2px 7px;
    opacity: 0.5;
    font-size: 0.9em;
  }
}
</style>
