import {
  Box,
  Button,
  Flex,
  SingleSelect,
  SingleSelectOption,
  Table,
  Tbody,
  Th,
  Thead,
  Tr,
  Typography,
} from '@strapi/design-system';
import { useFetchClient } from '@strapi/strapi/admin';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
export default function Permissions() {
  const { id } = useParams();

  const fetchClient = useFetchClient();
  const { get, post } = fetchClient;

  const [department, setDepartment] = useState<any>({});
  const [permissions, setPermissions] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  const fetchDepartmentPermissions = () => {
    get(`/crm-permissions/departments/${id}/permissions`).then((res) => {
      setDepartment(res.data?.department);
      setPermissions(res.data?.permissions);
    });
  };

  useEffect(() => {
    if (id) {
      fetchDepartmentPermissions();
    }
  }, [id]);

  const onChangePermission = (key: string, action: string, newType: string) => {
    let updatePermissions = { ...permissions };
    updatePermissions[key].permissions[action].type = newType;
    setPermissions(updatePermissions);
  };

  const onSave = () => {
    // console.log(permissions);
    setIsSaving(true);
    post(`/crm-permissions/departments/${id}/permissions`, permissions).then(
      () => {
        setIsSaving(false);
      }
    );
  };

  return (
    <Box padding={6}>
      <Flex>
        <Box marginBottom={6}>
          <Typography variant='delta' fontWeight='bold'>
            Department: {department?.name}
          </Typography>
          <Typography
            variant='epsilon'
            textColor='neutral600'
            style={{ fontSize: '1.1rem', paddingLeft: 10 }}
          >
            Manage permissions for {department?.name}
          </Typography>
        </Box>
        <Box marginLeft='auto' marginBottom={6}>
          <Button
            onClick={() => {
              onSave();
            }}
            disabled={isSaving}
            loading={isSaving}
          >
            Save
          </Button>
        </Box>
      </Flex>

      <Box padding={8} background='neutral100'>
        <Table colCount={10} rowCount={4}>
          <Thead>
            <Tr>
              <Th>
                <Typography variant='sigma'>Collection</Typography>
              </Th>
              <Th>
                <Typography variant='sigma'>Read</Typography>
              </Th>
              <Th>
                <Typography variant='sigma'>Update</Typography>
              </Th>
              <Th>
                <Typography variant='sigma'>Delete</Typography>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {Object.entries(permissions).map(([key, item]: any) => (
              <Tr key={`${key}-permissions`}>
                <Th>
                  <Typography variant='omega'>
                    {item.collection.name}
                  </Typography>
                </Th>
                <Th>
                  <SingleSelect
                    value={item.permissions?.read?.type}
                    onChange={(value: any) => {
                      onChangePermission(key, 'read', value);
                    }}
                  >
                    <SingleSelectOption value='org'>
                      Org-Chart
                    </SingleSelectOption>
                    <SingleSelectOption value='me'>Only Me</SingleSelectOption>
                    <SingleSelectOption value='all'>All</SingleSelectOption>
                  </SingleSelect>
                </Th>
                <Th>
                  <SingleSelect
                    value={item.permissions?.update?.type}
                    onChange={(value: any) => {
                      onChangePermission(key, 'update', value);
                    }}
                  >
                    <SingleSelectOption value='org'>
                      Org-Chart
                    </SingleSelectOption>
                    <SingleSelectOption value='me'>Only Me</SingleSelectOption>
                    <SingleSelectOption value='all'>All</SingleSelectOption>
                  </SingleSelect>
                </Th>
                <Th>
                  <SingleSelect
                    value={item.permissions?.delete?.type}
                    onChange={(value: any) => {
                      onChangePermission(key, 'delete', value);
                    }}
                  >
                    <SingleSelectOption value='org'>
                      Org-Chart
                    </SingleSelectOption>
                    <SingleSelectOption value='me'>Only Me</SingleSelectOption>
                    <SingleSelectOption value='all'>All</SingleSelectOption>
                  </SingleSelect>
                </Th>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}
