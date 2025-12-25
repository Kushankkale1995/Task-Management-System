import { useEffect, useState } from "react";
import { Input, Button, List, Card, Space, message, Modal, Form, Empty, Spin } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { getCategories, createCategory, deleteCategory, updateCategory } from "../../api/category.api";

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await getCategories();
      setCategories(res.data || []);
    } catch (err) {
      message.error("Error loading categories");
      console.error("Error loading categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleAddCategory = () => {
    setEditingCategory(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    form.setFieldsValue({ name: category.name });
    setModalVisible(true);
  };

  const handleDeleteCategory = async (id) => {
    try {
      await deleteCategory(id);
      message.success("Category deleted successfully");
      loadCategories();
    } catch (err) {
      message.error(err.response?.data?.message || "Error deleting category");
      console.error("Error deleting category:", err);
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingCategory) {
        // Update category
        await updateCategory(editingCategory._id, values);
        message.success("Category updated successfully");
      } else {
        // Create category
        await createCategory(values);
        message.success("Category created successfully");
      }
      setModalVisible(false);
      form.resetFields();
      loadCategories();
    } catch (err) {
      message.error(err.response?.data?.message || "Error saving category");
      console.error("Error saving category:", err);
    }
  };

  return (
    <div className="space-y-4">
      <Card
        title="Manage Categories"
        className="shadow"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddCategory}
          >
            Add Category
          </Button>
        }
      >
        <Spin spinning={loading}>
          {categories.length > 0 ? (
            <List
              dataSource={categories}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button
                      type="primary"
                      size="small"
                      icon={<EditOutlined />}
                      onClick={() => handleEditCategory(item)}
                    />,
                    <Button
                      danger
                      size="small"
                      icon={<DeleteOutlined />}
                      onClick={() => {
                        Modal.confirm({
                          title: "Delete Category",
                          content: "Are you sure you want to delete this category?",
                          okText: "Yes",
                          cancelText: "No",
                          onOk: () => handleDeleteCategory(item._id),
                        });
                      }}
                    />,
                  ]}
                >
                  <List.Item.Meta title={item.name} />
                </List.Item>
              )}
            />
          ) : (
            <Empty description="No categories yet" />
          )}
        </Spin>
      </Card>

      <Modal
        title={editingCategory ? "Edit Category" : "Add New Category"}
        visible={modalVisible}
        onOk={() => form.submit()}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        okText={editingCategory ? "Update" : "Create"}
        cancelText="Cancel"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="Category Name"
            rules={[{ required: true, message: "Category name is required" }]}
          >
            <Input placeholder="Enter category name" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryManager;
