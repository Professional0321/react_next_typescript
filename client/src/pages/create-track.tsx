import { LinkOutlined } from '@ant-design/icons';
import {
    Button,
    Form,
    Input,
    Typography,
} from 'antd';
import React, { useState } from 'react';

const { Title } = Typography;

type formProps = {
    name: string,
    url: string,
}

const CreateTrack: React.FC<{}> = ({ }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState<boolean>(false);
    // const [errors, setErrors] = useState<Array>([]);

    // const [, login] = useLoginMutation();
    // const router = useRouter();

    const onFinish = async (values: formProps) => {
        setLoading(true);
        console.log('Received values of form: ', values);
        // const response = await login(values);
        // console.log(response);
        // // On error
        // if (response.data?.login.errors) {
        //     setLoading(false);
        //     console.log(response.data.login.errors)
        //     // TODO: setFields error (username taken, password length too short, etc)
        //     // On success
        // } else if (response.data?.login.user) {
        //     setLoading(false);
        //     router.push('/');
        // };
    };

    return (
        <>
            <Title style={{ textAlign: 'center', color: '#f3f5f9' }}>Ajouter une musique</Title>
            <Form
                name="create_track"
                className="create-track-form"
                layout="vertical"
                onFinish={onFinish}
                scrollToFirstError
            >
                <Form.Item
                    name="name"
                    label="Nom - Titre"
                    rules={[{
                        required: true,
                        message: 'Veuillez entrer le nom et titre de la musique séparé par un " - " (comme titré ou copier/collé du lien). !'
                    }]}
                >
                    <Input placeholder="Nom - Titre de la musique" />
                </Form.Item>
                <Form.Item
                    name="url"
                    label="Lien"
                    rules={[{ required: true, message: 'Veuillez entre un lien Youtube vers la musique !' }]}
                >
                    <Input
                        prefix={<LinkOutlined className="site-form-item-icon" />}
                        type="text"
                        placeholder="Lien de la musique (YouTube/Soundcloud)"
                    />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button" loading={loading}>
                        Ajouter la musique
                    </Button>
                </Form.Item>
            </Form>
        </>
    )

}

export default CreateTrack;