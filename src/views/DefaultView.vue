<template>
    <main class="main">
        <AppAutocomplete
            :searchValue="usersAutocomplete.searchQuery"
            :options="usersAutocomplete.options"
            :is-loading="usersAutocomplete.isLoading"
            @input-search-value="onUsersAutocompleteInputSearchQuery"
            @select-value="onUsersAutocompleteSelectValue"
        />
    </main>
</template>

<style lang="scss" scoped>
    .main {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
    }
</style>

<script>
import _debounce from "lodash/debounce";
import { UserService } from "@/services/users/UsersService.js";
import AppAutocomplete from "@/components/AppAutocomplete.vue";

export default {
      name: "DefaultView",

      components: {
        AppAutocomplete
      },

      data: () => {
        return {
          usersAutocomplete: {
            value: null,
            searchQuery: null,
            options: [],
            optionsLimit: 5,
            isLoading: false
          }
        };
      },

      computed: {
        debounceUsersRequest () {
          return _debounce(this.getUsersSearchResult, 600, { trailing: true });
        }
      },

      methods: {
        onUsersAutocompleteSelectValue (userLogin) {
          this.usersAutocomplete.value = userLogin;
          this.usersAutocomplete.searchQuery = userLogin;
        },

        updateUsersAutocompleteSearchQuery (queryString) {
          this.usersAutocomplete.searchQuery = queryString;
        },

        updateUsersAutocompleteOptions (users) {
          const limitedUsers = users?.slice(0, this.usersAutocomplete.optionsLimit) ?? [];

          this.usersAutocomplete.options = limitedUsers.map(usersItem => {
            return {
              id: usersItem.id,
              label: usersItem.login
            };
          });
        },

        emptyUsersAutocompleteOptions() {
          this.usersAutocomplete.options = [];
        },

        updateUsersAutocompleteIsLoading (isLoading) {
          this.usersAutocomplete.isLoading = isLoading;
        },

        handleUsersRequestError (error) {
          const isRequestLimitError = error?.response?.data?.message?.includes("API rate limit exceeded");

          if (isRequestLimitError) {
            alert("API rate limit exceeded. Please try a little bit later.");
          } else {
            alert(`Something went wrong: ${ error }`);
          }
        },

        async getUsersSearchResult () {
          const userLogin = this.usersAutocomplete.searchQuery;

          if (userLogin) {
            try {
              this.updateUsersAutocompleteIsLoading(true);

              const { data: { items: users } } = await UserService.searchUserByLogin(userLogin);

              this.updateUsersAutocompleteOptions (users);
            } catch (error) {
              this.handleUsersRequestError(error);
            } finally {
              this.updateUsersAutocompleteIsLoading(false);
            }
          } else {
            this.emptyUsersAutocompleteOptions();
          }
        },

        onUsersAutocompleteInputSearchQuery (value) {
            this.updateUsersAutocompleteSearchQuery(value);
            this.debounceUsersRequest();
        }
      }
    };
</script>
