import { UserOutlined } from '@ant-design/icons';
import {
    Button,
    Form,
    Input,

    Result, Typography
} from 'antd';
import { withUrqlClient } from 'next-urql';
import NextLink from "next/link";
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useForgotPasswordMutation } from '../generated/graphql';
import '../styles/components/login.less';
import { createUrqlClient } from '../utils/createUrqlClient';

const { Title } = Typography;

type formProps = {
    email: string,
}

export const ForgotPassword: React.FC<{}> = ({ }) => {
    const [form] = Form.useForm();
    const [complete, setComplete] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    // const [errors, setErrors] = useState<Array>([]);

    const [, forgotPassword] = useForgotPasswordMutation();
    const router = useRouter();

    const onFinish = async (values: formProps) => {
        setLoading(true);
        console.log('Received values of form: ', values);
        await forgotPassword(values);
        setComplete(true);
        setLoading(false);

    };

    return (
        <>
            <Title style={{ textAlign: 'center', color: '#f3f5f9' }}>Mot de passe oublié</Title>

            <Form
                name="normal_login"
                className="login-form"
                // initialValues={{ remember: true }}
                onFinish={onFinish}
                scrollToFirstError
            >
                <Form.Item
                    name="email"
                    rules={[{ required: true, message: 'Veuillez entrer votre e-mail !' }]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="E-mail" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button" loading={loading}>
                        J'ai oublié mon mot de passe
        </Button>
                </Form.Item>

                {complete && (
                    <Result
                        status="success"
                        title="Opération éxécutée !"
                        subTitle="Si un compte est associé à cette adresse, un email a été envoyé."
                        extra={
                            <NextLink href="/">
                                <Button type="primary" key="console">
                                    Retourner à l'accueil
                            </Button>
                            </NextLink>
                        }
                    />
                )}
            </Form>

        </>
    );
};

export default withUrqlClient(createUrqlClient)(ForgotPassword);