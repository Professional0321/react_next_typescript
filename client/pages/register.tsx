import React from 'react'
import {
    Form,
    Input,
    Button,
    Typography,
    Tooltip,
} from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface registerProps {

}

const Register: React.FC<registerProps> = ({ }) => {
    const [form] = Form.useForm();

    const onFinish = values => {
        console.log('Received values of form: ', values);
    };

    return (
        <>
            <Title>Inscription</Title>
            <Form
                {...formItemLayout}
                form={form}
                layout="vertical"
                name="register"
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
        rules={[{ required: true, message: 'Veuillez entrer votre nom d\'utilisatuer !', whitespace: true }]}
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
                            message: 'Veuillez saisir votre e-mail !',
                        },
                    ]}
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

                                return Promise.reject('Les deux mots de passe que vous avez saisis ne correspondent pas !');
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        S'inscrire
              </Button>
                </Form.Item>
            </Form>
        </>
    );
}

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


export default Register;