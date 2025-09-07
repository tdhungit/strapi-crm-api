import {
  Box,
  Button,
  Card,
  CardBadge,
  CardBody,
  CardContent,
  CardSubtitle,
  CardTitle,
  Typography,
} from '@strapi/design-system';
import { Pencil } from '@strapi/icons';
import { useFetchClient } from '@strapi/strapi/admin';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Departments() {
  const navigation = useNavigate();

  const fetchClient = useFetchClient();
  const { get, post } = fetchClient;

  const [departments, setDepartments] = useState([]);

  const fetchDepartments = () => {
    get('/crm-permissions/departments').then((res) => {
      setDepartments(res.data?.results || []);
    });
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleEditDepartment = (id: number) => {
    navigation(`/plugins/crm-permissions/departments/${id}/permissions`);
  };

  return (
    <Box padding={6}>
      <Box marginBottom={6}>
        <Typography variant='delta' fontWeight='bold'>
          Departments
        </Typography>
        <Typography
          variant='epsilon'
          textColor='neutral600'
          style={{ fontSize: '1.1rem', paddingLeft: 10 }}
        >
          Manage all departments in your organization
        </Typography>
      </Box>

      {departments.length > 0 ? (
        departments.map((department: any) => (
          <Card style={{ marginBottom: 10 }}>
            <CardBody>
              <CardContent>
                <CardTitle>{department.name}</CardTitle>
                <CardSubtitle>
                  {department.users?.length || 0} members
                </CardSubtitle>
              </CardContent>
              <CardBadge>
                <Button
                  variant='tertiary'
                  size='S'
                  onClick={() => handleEditDepartment(department.id)}
                  startIcon={<Pencil />}
                >
                  Edit
                </Button>
              </CardBadge>
            </CardBody>
          </Card>
        ))
      ) : (
        <Box background='neutral0' hasRadius shadow='filterShadow' padding={8}>
          <Typography textAlign='center'>
            No departments found. Create your first department to get started.
          </Typography>
        </Box>
      )}
    </Box>
  );
}
