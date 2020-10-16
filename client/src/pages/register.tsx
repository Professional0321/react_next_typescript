import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Form, Input, Tooltip, Typography } from 'antd';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useRegisterMutation } from '../generated/graphql';
import '../styles/components/register.less';
import { ErrorProps, TRegisterFormProps } from '../types';
import { createUrqlClient } from '../utils/createUrqlClient';

const { Title } = Typography;

const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 8,
        },
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 16,
        },
    },
};

const Register: React.FC = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<ErrorProps | undefined>(undefined);

    const [, register] = useRegisterMutation();
    const router = useRouter();

    const onFinish = async (values: TRegisterFormProps) => {
        setLoading(true);
        console.log('Received values of form: ', values);
        const response = await register({ options: values });
        // On error
        // console.log(response);
        if (response.data?.register.errors) {
            setLoading(false);
            // console.log(response.data.register.errors);
            setError(response.data.register.errors[0]);
            // TODO: setFields error (username taken, password length too short, etc)
            // On success
        } else if (response.data?.register.user) {
            setLoading(false);
            router.push('/');
        }
    };

    return (
        <>
            <Title style={{ textAlign: 'center', color: '#f3f5f9' }}>Inscription</Title>
            <Form
                // {...formItemLayout}
                form={form}
                layout="vertical"
                className="register-form"
                onFinish={onFinish}
                scrollToFirstError
            >
                <Form.Item
                    name="username"
                    label={
                        <span>
                            Nom d'utilisateur&nbsp;
                            <Tooltip title="Comment voulez-vous que les autres vous appellent ?">
                                <QuestionCircleOutlined />
                            </Tooltip>
                        </span>
                    }
                    rules={[
                        {
                            required: true,
                            message: "Veuillez entrer votre nom d'utilisateur !",
                            whitespace: true,
                        },
                    ]}
                    {...(error?.field === 'username' && {
                        validateStatus: 'error',
                        help: error?.message,
                    })}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="email"
                    label="E-mail"
                    rules={[
                        {
                            type: 'email',
                            message: 'Adresse e-mail non valide !',
                        },
                        {
                            required: true,
                            message: 'Veuillez saisir votre adresse e-mail !',
                        },
                    ]}
                    {...(error?.field === 'email' && {
                        validateStatus: 'error',
                        help: error?.message,
                    })}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Mot de passe"
                    rules={[
                        {
                            required: true,
                            message: 'Veuillez saisir votre mot de passe !',
                        },
                    ]}
                    hasFeedback
                    {...(error?.field === 'password' && {
                        validateStatus: 'error',
                        help: error?.message,
                    })}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="confirm"
                    label="Confirmer le mot de passe"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Veuillez confirmer votre mot de passe !',
                        },
                        ({ getFieldValue }) => ({
                            validator(rule, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }

                                return Promise.reject(
                                    new Error('Les deux mots de passe que vous avez saisis ne correspondent pas !'),
                                );
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        S'inscrire
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default withUrqlClient(createUrqlClient)(Register);
