import { FormGroup, Label, Input, Row, Col } from "reactstrap";
import sanatizeHtml from "sanitize-html";

export default function CustomerDetailForm({
  handleCustomerDetailForm,
  customerDetail,
}) {
  return (
    <>
      <Row>
        <Col md={6}>
          <FormGroup>
            <Label for="name" className="font-medium">
              Customer Name
            </Label>
            <Input
              type="text"
              name="name"
              id="name"
              placeholder="Enter customer name"
              onChange={(e) =>
                handleCustomerDetailForm({
                  ...customerDetail,
                  custName: sanatizeHtml(e.target.value),
                })
              }
            />
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label for="email" className="font-medium">
              Customer Email
            </Label>
            <Input
              type="email"
              name="email"
              id="email"
              placeholder="Enter customer email"
              onChange={(e) =>
                handleCustomerDetailForm({
                  ...customerDetail,
                  custEmail: sanatizeHtml(e.target.value),
                })
              }
            />
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <FormGroup>
            <Label for="phone" className="font-medium">
              Customer Phone
            </Label>
            <Input
              type="number"
              name="phone"
              id="phone"
              placeholder="Enter customer phone"
              onChange={(e) =>
                handleCustomerDetailForm({
                  ...customerDetail,
                  custPhone: sanatizeHtml(e.target.value),
                })
              }
            />
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label for="address" className="font-medium">
              Customer Address
            </Label>
            <Input
              type="text"
              name="address"
              id="address"
              placeholder="Enter customer address"
              onChange={(e) =>
                handleCustomerDetailForm({
                  ...customerDetail,
                  custAddress: sanatizeHtml(e.target.value),
                })
              }
            />
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <FormGroup>
            <Label for="sysCapacity" className="font-medium">
              System Capacity
            </Label>
            <Input
              type="text"
              name="sysCapacity"
              id="sysCapacity"
              placeholder="Enter customer system capacity"
              onChange={(e) =>
                handleCustomerDetailForm({
                  ...customerDetail,
                  custSysCapacity: sanatizeHtml(e.target.value),
                })
              }
            />
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label for="sysAge" className="font-medium">
              System Age
            </Label>
            <Input
              type="text"
              name="sysAge"
              id="sysAge"
              placeholder="Enter customer system age"
              onChange={(e) =>
                handleCustomerDetailForm({
                  ...customerDetail,
                  custSysAge: sanatizeHtml(e.target.value),
                })
              }
            />
          </FormGroup>
        </Col>
      </Row>
    </>
  );
}
