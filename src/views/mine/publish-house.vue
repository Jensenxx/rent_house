<template>
  <div class="publish">
    <my-header :title="'添加房源'" :leftArrow="true" @goBack="handleGoBack"/>
    <van-cell-group>
      <van-field
        label="地址:"
        v-model="address"
        placeholder="请选择"
        required
        clickable
        is-link
        disabled
        @click="showArea=true"
      />
      <van-field
        label="详细地址:"
        placeholder="请输入"
        right-icon="search"
        required
        clearable
        v-model="house.descAddress"
        @click-right-icon="handleSearchAddress"
      />
      <van-field
        label="房源标题:"
        placeholder="请输入"
        required
        v-model="house.houseTitle"
      />
      <van-cell title="楼栋" class="floor" required>
        <template>
          <input placeholder="" v-model.number="house.building" maxlength="2"/>栋
          <input placeholder="" v-model.number="house.unit" maxlength="2"/>单元
        </template>
      </van-cell>
      <van-cell title="租金" class="floor" required>
        <template>
          <input placeholder="" maxlength="4" v-model.number="house.rent" style="width: 50px"/>元/月
        </template>
      </van-cell>
     <van-field
        label="租赁方式:"
        v-model="house.rentType"
        placeholder="请选择"
        required
        clickable
        is-link
        disabled
        @click="showRentType=true"
      />
      <van-cell title="户型" class="floor" required>
        <template>
          <input placeholder="" v-model.number="fang" maxlength="2"/>房
          <input placeholder="" v-model.number="ting" maxlength="2"/>厅
          <input placeholder="" v-model.number="wei" maxlength="2"/>卫
          <input placeholder="" v-model.number="chu" maxlength="2"/>厨
          <input placeholder="" v-model.number="yang" maxlength="2"/>阳台
        </template>
      </van-cell>
      <van-cell title="面积" class="floor" required>
        <template>
          <input placeholder="" v-model.number="house.area" maxlength="3" style="width: 50px"/>平方
        </template>
      </van-cell>
      <van-cell title="楼层" class="floor" required>
        <template>
          第<input placeholder=""  v-model.number="house.floor" maxlength="3" style="width: 30px;"/>层,
          总<input placeholder="" v-model.number="house.allFloor" maxlength="3" style="width: 30px"/>层
        </template>
      </van-cell>
      <van-cell title="配套设施" class="floor" required>
        <template>
         <van-checkbox-group v-model="result" direction="horizontal">
          <van-checkbox name="水">水</van-checkbox>
          <van-checkbox name="电">电</van-checkbox>
          <van-checkbox name="宽带">宽带</van-checkbox>
          <van-checkbox name="电梯">电梯</van-checkbox>
          <van-checkbox name="煤气/天然气">煤气/天然气</van-checkbox>
          <van-checkbox name="暖气">暖气</van-checkbox>
          <van-checkbox name="有线电视">有线电视</van-checkbox>
        </van-checkbox-group>
        </template>
      </van-cell>
      <van-field
        label="房源描述:"
        placeholder="请输入"
        autosize
        type="textarea"
        maxlength="50"
        show-word-limit
        required
        v-model="house.houseDesc"
      />
      <van-cell title="图片上传" class="floor" required>
        <template>
          <van-uploader v-model="imgList"/>
        </template>
      </van-cell>
       <van-field
        label="联系人:"
        placeholder="请输入"
        required
        v-model="house.contactPerson"
      />
       <van-field
        label="手机号:"
        placeholder="请输入"
        required
        v-model.number="house.phoneNum"
      />
      <van-button type="info" size="small" style="margin:30px 0 30px 50%;transform: translate(-50%,0);" @click="handlePublish">添加</van-button>
    </van-cell-group>
    <van-popup v-model="showArea" position="bottom">
      <van-area
        :area-list="areaList"
        :columns-num="3"
        @confirm="hanleConfirmCity"
        @cancel="showArea=false"
      />
    </van-popup>
    <van-popup v-model="showRentType" position="bottom">
      <van-picker
        show-toolbar
        :columns="rentTypeSelect"
        @cancel="showRentType=false"
        @confirm="handleConfirmRentType"
      />
    </van-popup>
    <van-popup
      v-model="showAddressBaidu"
      closeable
      position="bottom"
      :style="{ height: '30%' }"
    >
      <div class="container" >
        <van-radio-group v-model="radio">
          <van-cell-group>
            <van-cell :title="`${item.province} - ${item.city} - ${item.district} - ${item.name}`" clickable v-for="(item, index) in areaforBaiduList" :key="index" @click="handleClick(item)">
              <template #right-icon>
                <van-radio :name="`${item.province} - ${item.city} - ${item.district} - ${item.name}`"/>
              </template>
            </van-cell>
          </van-cell-group>
          <div style="text-align:center">
            <p v-if="!areaforBaiduList.length">暂无此记录</p>
          </div>
        </van-radio-group>
      </div>
    </van-popup>
  </div>
</template>

<script>
import MyHeader from '../../components/common/my-header'
import areaList from '../../assets/js/area'
import { Field, CellGroup, Button, Cell, Area, Picker } from 'vant'
import axios from 'axios'
export default {
  components: {
    MyHeader,
    [Field.name]: Field,
    [CellGroup.name]: CellGroup,
    [Button.name]: Button,
    [Cell.name]: Cell,
    [Area.name]: Area,
    [Picker.name]: Picker
  },
  data () {
    return {
      areaList,
      showArea: false,
      address: '',
      showRentType: false,
      rentTypeSelect: ['整租', '合租'],
      result: [], // 记录所选的配套设施
      areaforBaiduList: [],
      showAddressBaidu: false,
      fang: '', // 房
      ting: '', // 房
      wei: '', // 房
      chu: '', // 房
      yang: '', // 房
      radio: '',
      imgList: [],
      house: {
        province: '', // 省
        city: '', // 市
        region: '', // 区
        descAddress: '', // 详细地址
        houseTitle: '', // 房源标题
        building: '', // 栋
        unit: '', // 单元
        rent: '', // 租金
        rentType: '', // 租赁类型
        unitType: '', // 户型
        area: '', // 面积
        floor: '', // 第几层
        allFloor: '', // 共
        supportingFacilities: '', // 配套设施
        houseDesc: '', // 房子描述
        contactPerson: '', // 联系人
        phoneNum: '', // 手机号
        photosAddress: '', // 图片上传
        xPosition: '', // 精度
        yPosition: '', // 维度
        ownUserNum: '' // 房子所属
      }
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.userInfo
    }
  },
  methods: {
    handleGoBack () {
      this.$router.go(-1)
    },
    handlePublish () {
      this.house.unitType = `${this.fang}房${this.ting}厅${this.wei}卫${this.chu}厨${this.yang}阳台`
      this.house.supportingFacilities = this.result.join('')
      this.house.ownUserNum = this.userInfo.userNum
      console.log(this.house)
      this.$api('/addHouse', 'post', this.house).then(res => {
        this.showToast({ msg: '添加成功' })
        setTimeout(() => {
          this.$router.go(-1)
        }, 1000)
      })
    },
    hanleConfirmCity (value) {
      console.log(value)
      this.showArea = false
      this.address = value.reduce((res, item) => {
        res += item.name + ' '
        return res
      }, '')
    },
    handleConfirmRentType (value) {
      this.showRentType = false
      this.house.rentType = value
    },
    handleSearchAddress () {
      this.getArea(this.house.descAddress)
      this.showAddressBaidu = true
    },
    handleClick (item) {
      this.radio = `${item.province} - ${item.city} - ${item.district} - ${item.name}`
      this.address = `${item.province} - ${item.city} - ${item.district}`
      this.house.province = item.province
      this.house.city = item.city
      this.house.region = item.district
      this.house.descAddress = item.name
      this.house.xPosition = item.location.lng
      this.house.yPosition = item.location.lat
      this.showAddressBaidu = false
    },
    getArea (address) {
      axios.get('/apibaidu/place/v2/suggestion', {
        params: {
          query: address,
          region: '全国',
          output: 'json',
          ak: 'lIXbW84tKu6oNCj0bbgTnau7'
        }
      }).then(res => {
        this.areaforBaiduList = res.data.result
        console.log(res)
      })
    }
  },
  mounted () {
  }
}
</script>

<style lang="less" scoped>
  .floor{
    .van-cell__title{
    }
    .van-cell__value {
      flex: 160px; /*no*/
      text-align: left;
      display: flex;
      align-items: center;
      input{
        width: 30px;
        color: #000;
        text-align:center;
        margin-right: 10px;
        &:not(:first-child){
          margin-left: 10px;
        }
      }
      .van-checkbox{
        margin-top:15px;
      }
    }
  }
  .container{
    width: 100%;
    height: 80%;
    margin-top: 100px;
    overflow: scroll;
    padding: 0 40px;
    p{
      font-size: 16px; /*no*/
    }
  }
</style>
