<template>
  <div class="login-dialog">
    <Dropdown v-if="isLogin" :trigger="['click']" placement="bottomRight">
      <Avatar :src="avatarSrc"> </Avatar>
      <Menu slot="overlay" @click="handleSelect">
        <MenuItem key="info" @click="showInfo"> 个人信息 </MenuItem>
        <MenuItem key="logout"> 退出登录 </MenuItem>
      </Menu>
    </Dropdown>
    <Avatar v-else :src="avatarSrc" @click="handleQr"></Avatar>
    <span style="margin-left: 10px" @click="handleQr">{{
      profile.nickname || '登录'
    }}</span>

    <!-- 验证码登录(网易云加了校验，暂时无法登陆) -->
    <AModal
      title="手机账号登录"
      v-model="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
      okText="登录"
      cancelText="取消"
      centered
      width="350px"
    >
      <Form ref="ruleForm" :model="form" :rules="rules">
        <FormItem prop="phone">
          <AInput
            v-model="form.phone"
            placeholder="手机号"
            maxlength="11"
            allowClear
          >
            <Icon
              slot="prefix"
              type="user"
              style="color: rgba(0, 0, 0, 0.25)"
            />
          </AInput>
        </FormItem>

        <FormItem prop="captcha" layout="inline">
          <div class="code-wrap">
            <AInput
              v-model="form.captcha"
              maxlength="4"
              placeholder="验证码"
              allowClear
            >
              <Icon
                slot="prefix"
                type="lock"
                style="color: rgba(0, 0, 0, 0.25)"
              />
            </AInput>
            <div
              class="right"
              :class="{ 'is-senting': isSenting }"
              @click="handleCount"
            >
              <span v-if="isSenting"> {{ count }}s后重新获取 </span>
              <template v-else>获取验证码</template>
            </div>
          </div>
        </FormItem>
      </Form>
    </AModal>

    <!-- 二维码登录 -->
    <AModal
      v-model="qrVisible"
      :footer="null"
      :z-index="100000"
      width="260px"
      @cancel="handleCancel"
    >
      <div class="qr-wrap" :class="{ disabled: qrCode === 800 }">
        <Spin :spinning="qrCode === 802">
          <img :src="qrSrc" class="qr" />
        </Spin>
        <div class="text">{{ qrText }}</div>
      </div>
    </AModal>
  </div>
</template>

<script>
import {
  Avatar,
  Dropdown,
  Menu,
  FormModel,
  Input,
  Icon,
  Spin,
} from 'ant-design-vue';
import {
  fetchLoginStatus,
  captchaSent,
  cellphoneLogin,
  qrKey,
  qrCreate,
  qrCheck,
  registerAnonimous,
  loginRefresh,
} from '../../../api/login';

export default {
  name: 'LoginModal',

  components: {
    Avatar,
    Dropdown,
    Menu,
    MenuItem: Menu.Item,
    Form: FormModel,
    FormItem: FormModel.Item,
    AInput: Input,
    Icon,
    Spin,
  },

  data() {
    return {
      form: {
        phone: '',
        captcha: '',
      },
      userInfo: {
        phone: '15797717425',
        password: ' zhang1221lxq',
      },
      qrVisible: false,
      qrSrc: '',
      rules: {
        phone: [
          { required: true, message: '请输入手机号码', whitespace: true },
          {
            pattern: /^1[3456789]\d{9}$/,
            message: '请输入正确的手机格式',
            trigger: 'blur',
          },
        ],
        captcha: [
          { required: true, message: '请输入验证码', whitespace: true },
        ],
      },
      visible: false,
      confirmLoading: false,
      isSenting: false,
      count: 60,
      // 二维码扫码状态
      qrCode: 801,
      qrNickName: '',
      defaultAvatar:
        'http://s4.music.126.net/style/web2/img/default/default_avatar.jpg?param=50y50',
    };
  },

  computed: {
    avatarSrc() {
      return (
        this.$store.state.siyeMusic.profile?.avatarUrl || this.defaultAvatar
      );
    },

    isLogin() {
      return !!this.$store.state.siyeMusic.cookie;
    },

    profile() {
      return this.$store.state.siyeMusic?.profile || {};
    },

    qrText() {
      const textMap = {
        800: '二维码已失效',
        801: '请打开手机网易云音乐扫码',
        802: `${this.qrNickName}-登录确认中`,
        803: '扫码登录成功',
      };
      return textMap[this.qrCode];
    },

    cookie() {
      return this.$store.state.siyeMusic.cookie;
    },
  },

  created() {
    console.log('存储信息---', this.$store.state.siyeMusic);
  },

  beforeDestroy() {
    clearInterval(this.qrtime);
  },

  methods: {
    handleSelect({ key }) {
      if (key === 'logout') {
        this.$store.dispatch('siyeMusic/logout');
      }
    },

    // 二维码扫码登录
    async handleQr() {
      if (this.isLogin) return;

      // 获取二维码生成的key
      const { data } = await qrKey();

      // 通过key获取二维码图片
      const { data: qrData } = await qrCreate(data.unikey);
      this.qrSrc = qrData.qrimg;

      this.qrVisible = true;

      const codeArr = [800, 803, 502];
      // 轮询此接口可获取二维码扫码状态,800 为二维码过期,801 为等待扫码,802 为待确认,
      // 803 为授权登录成功(803 状态码下会返回 cookies),
      // 如扫码后返回502,则需加上noCookie参数,如&noCookie=true
      this.qrtime = setInterval(async () => {
        const { code, cookie, nickname } = await qrCheck(data.unikey);
        this.qrCode = code;
        if (code === 802) {
          this.qrNickName = nickname;
        }
        // console.log('循环', code, cookie, nickname);
        // 授权登录成功
        if (code === 803) {
          this.fetchInfo(cookie);

          this.qrVisible = false;
        }
        if (codeArr.includes(code)) clearInterval(this.qrtime);
      }, 1000);
    },

    async handleAnonimous(refresh = false) {
      if (this.isLogin) return;
      const api = refresh ? loginRefresh : registerAnonimous;

      const { cookie } = await api();

      this.fetchInfo(cookie);
    },

    async fetchInfo(cookie) {
      // 获取登录信息
      const {
        data: { account, profile, code },
      } = await fetchLoginStatus(cookie);

      if (code === -460) {
        this.handleAnonimous(true);
      }

      if (code === 200) {
        this.$store.commit('siyeMusic/setProfile', profile);
        this.$store.commit('siyeMusic/setAccount', account);

        this.$store.commit('siyeMusic/setCookie', cookie);
      }
    },

    showInfo() {
      console.log('个人信息---', this.profile);
    },

    handleCount() {
      const regExp = /^1[3456789]\d{9}$/;
      const result = regExp.test(this.form.phone);

      if (!result) return;

      if (this.isSenting) return;
      // 获取验证码
      captchaSent(this.form.phone);

      clearInterval(this.timer);
      this.count = 60;
      this.isSenting = true;
      this.timer = setInterval(() => {
        this.count -= 1;
        if (this.count === 0) {
          clearInterval(this.timer);
          this.isSenting = false;
        }
      }, 1000);
    },

    handleOk() {
      this.$refs.ruleForm.validate(async e => {
        if (!e) return;

        // 验证码登录
        await cellphoneLogin(this.form);
      });
    },

    handleCancel() {
      this.isSenting = false;
      clearInterval(this.timer);
      clearInterval(this.qrtime);
    },
  },
};
</script>
<style lang="less">
.ant-modal-footer {
  text-align: center;
}
</style>
<style lang="less" scoped>
@import '../../../styles/siye-music';
.login-dialog {
  display: inline-block;
  cursor: pointer;
}

.qr-wrap {
  text-align: center;

  &.disabled {
    opacity: 0.4;
  }

  .text {
    margin-top: 15px;
  }
}

.code-wrap {
  .ant-input-affix-wrapper {
    width: inherit;
  }
  .right {
    float: right;
    background-color: @primary-color;
    color: #fff;
    padding: 0 5px;
    border-radius: 3px;
    cursor: pointer;

    &.is-senting {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }
}
</style>
