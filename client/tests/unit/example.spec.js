import { shallowMount, mount } from "@vue/test-utils";
import Vue from "vue";
import Login from "../../src/components/Login.vue";
const MessageComponent = {
  template: "<p>{{ msg }}</p>",
  props: ["msg"],
  data(){
    return {
      err:'Hello'
    }
  },
};

describe("Login.vue", () => {
  test("displays message", () => {
    // mount() returns a wrapped Vue component we can interact with
    const wrapper = mount(MessageComponent, {
      propsData: {
        msg: "Hello world",
      },
    });
    // Assert the rendered text of the component
    expect(wrapper.text()).toContain("Hello world");
  });
  test('Check err :',async ()=>{
    const err= mount(Login, {
      data() {
        return {
          err: ''
        }
      }
    })
    const wrapper= mount(Login)
    expect(err.text()).toContain('')
  });
});
