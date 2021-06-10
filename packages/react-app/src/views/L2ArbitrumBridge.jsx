/* eslint-disable jsx-a11y/accessible-emoji */

import { SyncOutlined } from "@ant-design/icons";
import { utils, ethers } from "ethers";
import { Button, Card, DatePicker, Divider, Input, List, Progress, Slider, Spin, Switch, Form, Select, Option, InputNumber, Table, Tag, Space } from "antd";
import React, { useState, useEffect } from "react";
import { Address, Balance } from "../components";
import {
  useBalance,
  useContractLoader,
  useOnBlock
} from "../hooks";
import { NETWORKS } from "../constants";

export default function L2ArbitrumBridge({
  purpose,
  setPurposeEvents,
  address,
  mainnetProvider,
  localProvider,
  price,
  tx,
  readContracts,
  writeContracts,
  userSigner,
  contracts
}) {
 
const [L1EthBalance, setL1EthBalance] = useState("...");
const [L2EthBalance, setL2EthBalance] = useState("...");
const [L1Provider, setL1Provider] = useState("");
const [L2Provider, setL2Provider] = useState("");

 useEffect(() => {
    async function setProviders() {
      const L1RPC = NETWORKS.rinkeby;
      const L2RPC = NETWORKS.rinkebyArbitrum;
      setL1Provider(new ethers.providers.StaticJsonRpcProvider(L1RPC.rpcUrl));
      setL2Provider(new ethers.providers.StaticJsonRpcProvider(L2RPC.rpcUrl));
    }
    setProviders();
  }, []);

  useOnBlock(L1Provider, async () => {
    console.log(`⛓ A new mainnet block is here: ${L1Provider._lastBlockNumber}`);
    const yourL1Balance = await L1Provider.getBalance(address);
    setL1EthBalance(yourL1Balance ? ethers.utils.formatEther(yourL1Balance) : "...");
    const yourL2Balance = await L2Provider.getBalance(address);
    setL2EthBalance(yourL2Balance ? ethers.utils.formatEther(yourL2Balance) : "...");
  });


  const [newPurpose, setNewPurpose] = useState("loading...");
  const { Option } = Select;
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 12 },
    },
  };
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 12,
        offset: 8,
      },
    },
  };

  const columns = [
    {
      title: '',
      dataIndex: 'token',
      key: 'token',
      align: 'center',
    },
    {
      title: 'L1 Balance',
      dataIndex: 'l1',
      key: 'l1',
      align: 'center',
    },
    {
      title: 'Arbitrum Balance',
      dataIndex: 'l2',
      key: 'l2',
      align: 'center',
    },
  ]

  const data = [
    {
      key: '1',
      token: 'ETH',
      l1: 'Ξ' + L1EthBalance,
      l2: 'Ξ' + L2EthBalance,
    },
    // {
    //   key: '2',
    //   token: 'A TOKEN',
    //   l1: 'TOK 33',
    //   l2: 'TOK 22',
    // }
  ]

  const [form] = Form.useForm();

    const onAssetChange = (value) => {
      console.log(value)
    };

    const onRollupChange = (value) => {
      console.log(value)
    };

    async function onFinish(values){
      console.log(contracts.Inbox);
      console.log(values.amount.toString());
      const tx = await contracts.Inbox.depositEth(address,{value: utils.parseEther(values.amount.toString())});
      //showNotification(tx);
      await tx.wait();
      //loadContractData(freelancerContract);
    };

    const onReset = () => {
      form.resetFields();
    };

  return (
    <div style={{ padding: 16, width: 800, margin: "auto", marginBottom: 128 }}>
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 800, margin: "auto", marginBottom: 128 }}>
        <h2>Welcome to the L2 Arbitrum Bridge!</h2>

        <Table columns={columns} dataSource={data} pagination={false}
          style={{marginBottom:20}}
        />

        <Form {...formItemLayout} form={form} name="control-hooks" onFinish={onFinish}>
          <Form.Item
            name="assetType"
            label="Select Asset Type"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              placeholder="Select an asset type"
              onChange={onAssetChange}
              allowClear
            >
              <Option value="eth">ETH</Option>
              <Option disabled value="erc20">ERC-20</Option>
            </Select>
          </Form.Item>
          <Form.Item name="address" label="Address">
            <Input disabled placeholder={address} />
          </Form.Item>
          <Form.Item
            name="amount"
            label="Amount to bridge"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
