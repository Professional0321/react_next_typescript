import {
    Alert,
    Button,
    Form,
    Input,
    Typography,
} from 'antd';
import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import NextLink from "next/link";
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useChangePasswordMutation } from '../../generated/graphql';
import '../../styles/components/changePassword.less';
import { createUrqlClient } from '../../utils/createUrqlClient';

const { Title } = Typography;

type formProps = {
    newPassword: string,
    confirm: string,
}

export const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState<boolean>(false);
    // const [errors, setErrors] = useState<Array>([]);
    const [tokenError, setTokenError] = useState<String>('');

    const [, changePassword] = useChangePasswordMutation();
    const router = useRouter();

    const onFinish = async (values: formProps) => {
        setLoading(true);
        console.log('Received values of form: ', values);
        const response = await changePassword({
            newPassword: values.newPassword,
            token
        });
        // // On error
        if (response.data?.changePassword.errors) {
            const errors = response.data.changePassword.errors;

            errors.forEach((error) => {
                if ('token' === error.field) {
                    setTokenError(error.message);
                }
            })
            setLoading(false);
            // TODO: setFields error
            // On success
        } else if (response.data?.changePassword.user) {
            setLoading(false);
            router.push('/');
        };
    };

    return (
        <>
            <Title style={{ textAlign: 'center', color: '#f3f5f9' }}>Changer de mot de passe</Title>
            <Form
                name="changePassword_password"
                className="change-password-form"
                layout="vertical"
                onFinish={onFinish}
                scrollToFirstError
            >
                <Form.Item
                    name="newPassword"
                    label="Mot de passe"
                    rules={[
                        {
                            required: true,
                            message: 'Veuillez saisir votre nouveau mot de passe !',
                        },
                    ]}
                    hasFeedback
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="confirm"
                    label="Confirmer le mot de passe"
                    dependencies={['newPassword']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Veuillez confirmer votre mot de passe !',
                        },
                        ({ getFieldValue }) => ({
                            validator(rule, value) {
                                if (!value || getFieldValue('newPassword') === value) {
                                    return Promise.resolve();
                                }

                                return Promise.reject('Les deux mots de passe que vous avez saisis ne correspondent pas !');
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button" loading={loading}>
                        Changer le mot de passe
        </Button>
                </Form.Item>

                {tokenError &&
                    <Alert
                        type="error"
                        message={tokenError}
                        description={
                            <>
                                <NextLink href="/forgot-password">
                                    Cliquer ici pour en obtenir un nouveau.
                                  </NextLink>
                            </>
                        } />}

            </Form>

        </>
    );
}

ChangePassword.getInitialProps = ({ query }) => {
    return {
        token: query.token as string,
    };
};

export default withUrqlClient(createUrqlClient)(ChangePassword);