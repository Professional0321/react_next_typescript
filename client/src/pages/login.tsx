import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Typography } from 'antd';
import { withUrqlClient } from 'next-urql';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useLoginMutation } from '../generated/graphql';
import '../styles/components/login.less';
import { ErrorProps, TLoginFormProps } from '../types';
import { createUrqlClient } from '../utils/createUrqlClient';

const { Title } = Typography;

const Login: React.FC = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<ErrorProps | undefined>(undefined);

    const [, login] = useLoginMutation();
    const router = useRouter();

    const onFinish = async (values: TLoginFormProps) => {
        setLoading(true);
        console.log('Received values of form: ', values);
        const response = await login(values);
        // console.log(response);
        // On error
        if (response.data?.login.errors) {
            setLoading(false);
            setError(response.data.login.errors[0]);
            // On success
        } else if (response.data?.login.user) {
            setLoading(false);
            if (typeof router.query.next === 'string') {
                router.push(router.query.next);
            } else {
                router.push('/');
            }
        }
    };

    return (
        <>
            <Title style={{ textAlign: 'center', color: '#f3f5f9' }}>Connexion</Title>
            <Form
                name="normal_login"
                className="login-form"
                // initialValues={{ remember: true }}
                onFinish={onFinish}
                scrollToFirstError
            >
                <Form.Item
                    name="usernameOrEmail"
                    rules={[
                        {
                            required: true,
                            message: "Veuillez entrer votre nom d'utilisateur !",
                        },
                    ]}
                    {...(error?.field === 'username' && {
                        validateStatus: 'error',
                        help: error?.message,
                    })}
                >
                    <Input
                        prefix={<UserOutlined className="site-form-item-icon" />}
                        placeholder="Nom d'utilisateur ou e-mail"
                    />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Veuillez entre votre mot de passe !',
                        },
                    ]}
                    {...(error?.field === 'password' && {
                        validateStatus: 'error',
                        help: error?.message,
                    })}
                >
                    <Input
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Mot de passe"
                    />
                </Form.Item>
                <Form.Item>
                    {/* TODO: Implant longer exp. cookies */}
                    {/* <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Se souvenir de moi</Checkbox>
                    </Form.Item> */}

                    <Link href="/forgot-password">
                        <a className="login-form-forgot">Mot de passe oublié ?</a>
                    </Link>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button" loading={loading}>
                        Se connecter
                    </Button>
                    Ou <Link href="/register">S'inscrire maintenant !</Link>
                </Form.Item>
            </Form>
        </>
    );
};

export default withUrqlClient(createUrqlClient)(Login);
