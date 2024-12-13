import { FormGroup, Label, Input, Row, Col } from "reactstrap";
import sanatizeHtml from "sanitize-html";

export default function CustomerDetailForm({
  handleCustomerDetailForm,
  customerDetail,
  contractorDetail,
}) {
  return (
    <div>
      <div className="text-3xl">Customer Information</div>
      <hr />
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
              Customer Email ID
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
              Customer contact number
            </Label>
            <Input
              type="number"
              name="phone"
              id="phone"
              placeholder="Enter customer contact number"
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
              Site Address
            </Label>
            <Input
              type="text"
              name="address"
              id="address"
              placeholder="Enter site address"
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
            <Label for="pincode" className="font-medium">
              Site Address Pincode
            </Label>
            <Input
              type="text"
              name="pincode"
              id="pincode"
              placeholder="Enter site address pincode"
              onChange={(e) =>
                handleCustomerDetailForm({
                  ...customerDetail,
                  custPincode: sanatizeHtml(e.target.value),
                })
              }
            />
          </FormGroup>
        </Col>
      </Row>
      <br></br>
      <div className="text-3xl">Solar Installer Information</div>
      <hr />
      <Row>
        <Col md={6}>
          <FormGroup>
            <Label for="Solar installer company name" className="font-medium">
              Solar installer company name
            </Label>
            <Input
              type="text"
              name="Solar installer company name"
              id="Solar installer company name"
              value={contractorDetail.companyName}
              disabled
            />
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label for="Solar installer representative" className="font-medium">
              Solar installer representative
            </Label>
            <Input
              type="text"
              name="Solar installer representative"
              id="Solar installer representative"
              value={contractorDetail.fullName}
              disabled
            />
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <FormGroup>
            <Label for="Solar installer contact number" className="font-medium">
              Solar installer contact number
            </Label>
            <Input
              type="text"
              name="Solar installer contact number"
              id="Solar installer contact number"
              value={contractorDetail.phone}
              disabled
            />
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label for="Solar installer Email ID" className="font-medium">
              Solar installer Email ID
            </Label>
            <Input
              type="text"
              name="Solar installer Email ID"
              id="Solar installer Email ID"
              value={contractorDetail.email}
              disabled
            />
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <FormGroup>
            <Label for="Solar installer service person" className="font-medium">
              Solar installer service person
            </Label>
            <Input
              type="text"
              name="Solar installer service person"
              id="Solar installer service person"
              placeholder="Enter solar installer service person"
              onChange={(e) =>
                handleCustomerDetailForm({
                  ...customerDetail,
                  sollarInstallerServicePerson: sanatizeHtml(e.target.value),
                })
              }
              required
            />
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label
              for="Solar installer service person contact number"
              className="font-medium"
            >
              Solar installer service person contact number
            </Label>
            <Input
              type="text"
              name="Solar installer service person contact number"
              id="Solar installer service person contact number"
              placeholder="Enter solar installer service person contact number"
              onChange={(e) =>
                handleCustomerDetailForm({
                  ...customerDetail,
                  sollarInstallerServicePersonPhone: sanatizeHtml(
                    e.target.value
                  ),
                })
              }
              required
            />
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <FormGroup>
            <Label for="Solar installer office address" className="font-medium">
              Solar installer office address
            </Label>
            <Input
              type="text"
              name="Solar installer office address"
              id="Solar installer office address"
              value={contractorDetail.officeAddress}
              disabled
            />
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label for="Solar installer office pincode" className="font-medium">
              Solar installer office pincode
            </Label>
            <Input
              type="text"
              name="Solar installer office pincode"
              id="Solar installer office pincode"
              value={contractorDetail.pincode}
              disabled
            />
          </FormGroup>
        </Col>
      </Row>
      <br></br>
      <div className="text-3xl">System Information</div>
      <hr />
      <Row>
        <Col md={6}>
          <FormGroup>
            <Label
              for="Installed plant capacity (in kW)"
              className="font-medium"
            >
              Installed plant capacity (in kW)
            </Label>
            <Input
              type="text"
              name="Installed plant capacity (in kW)"
              id="Installed plant capacity (in kW)"
              placeholder="Enter Installed plant capacity (in kW)"
              onChange={(e) =>
                handleCustomerDetailForm({
                  ...customerDetail,
                  custSysCapacity: sanatizeHtml(e.target.value),
                })
              }
              required
            />
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label for="Inverter model name" className="font-medium">
              System age (in months) [For new system enter 0]
            </Label>
            <Input
              type="text"
              name="System age (in months) [For new system enter 0]"
              id="System age (in months) [For new system enter 0]"
              placeholder="Enter System age (in months)"
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
      <Row>
        <Col md={6}>
          <FormGroup>
            <Label for="Inverter manufacturer" className="font-medium">
              Inverter manufacturer
            </Label>
            <Input
              type="text"
              name="Inverter manufacturer"
              id="Inverter manufacturer"
              placeholder="Enter Inverter manufacturer"
              onChange={(e) =>
                handleCustomerDetailForm({
                  ...customerDetail,
                  custInstalledInverterCompany: sanatizeHtml(e.target.value),
                })
              }
              required
            />
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label for="Inverter model name" className="font-medium">
              Inverter model name
            </Label>
            <Input
              type="text"
              name="Inverter model name"
              id="Inverter model name"
              placeholder="Enter Inverter model name"
              onChange={(e) =>
                handleCustomerDetailForm({
                  ...customerDetail,
                  custInstalledInverterModel: sanatizeHtml(e.target.value),
                })
              }
              required
            />
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <FormGroup>
            <Label for="Inverter Capacity (kW)" className="font-medium">
              Inverter Capacity (kW)
            </Label>
            <Input
              type="text"
              name="Inverter Capacity (kW)"
              id="Inverter Capacity (kW)"
              placeholder="Enter Inverter Capacity (kW)"
              onChange={(e) =>
                handleCustomerDetailForm({
                  ...customerDetail,
                  custInverterCapacity: sanatizeHtml(e.target.value),
                })
              }
              required
            />
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label for="Three or Single phase system" className="font-medium">
              Three or Single phase system
            </Label>
            <Input
              type="select"
              name="Three or Single phase system"
              id="Three or Single phase system"
              onChange={(e) => {
                handleCustomerDetailForm({
                  ...customerDetail,
                  custThreeOrSinglePhase: sanatizeHtml(e.target.value),
                });
              }}
              required
            >
              <option value="">Select</option>
              <option key={0} value={1}>
                Single
              </option>
              <option key={1} value={3}>
                Three
              </option>
            </Input>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <FormGroup>
            <Label
              for="Installed inverter (Three or single phase)"
              className="font-medium"
            >
              Installed inverter (Three or single phase)
            </Label>
            <Input
              type="select"
              name="Installed inverter (Three or single phase)"
              id="Installed inverter (Three or single phase)"
              onChange={(e) => {
                handleCustomerDetailForm({
                  ...customerDetail,
                  custInstalledInverterSingleOrThreePhase: sanatizeHtml(
                    e.target.value
                  ),
                });
              }}
              required
            >
              <option value="">Select</option>
              <option key={0} value={1}>
                Single
              </option>
              <option key={1} value={3}>
                Three
              </option>
            </Input>
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label for="Solar panel manufacturer" className="font-medium">
              Solar panel manufacturer
            </Label>
            <Input
              type="text"
              name="Solar panel manufacturer"
              id="Solar panel manufacturer"
              placeholder="Enter Solar panel manufacturer"
              onChange={(e) =>
                handleCustomerDetailForm({
                  ...customerDetail,
                  custInstalledPanelCompany: sanatizeHtml(e.target.value),
                })
              }
              required
            />
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <FormGroup>
            <Label for="Panel Model name" className="font-medium">
              Panel Model name
            </Label>
            <Input
              type="text"
              name="Panel Model name"
              id="Panel Model name"
              placeholder="Enter Panel Model name"
              onChange={(e) =>
                handleCustomerDetailForm({
                  ...customerDetail,
                  custInstalledPanelModel: sanatizeHtml(e.target.value),
                })
              }
              required
            />
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label for="Solar panel type" className="font-medium">
              Solar panel type
            </Label>
            <Input
              type="text"
              name="Solar panel type"
              id="Solar panel type"
              placeholder="Enter Solar panel type"
              onChange={(e) =>
                handleCustomerDetailForm({
                  ...customerDetail,
                  custPanelType: sanatizeHtml(e.target.value),
                })
              }
              required
            />
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <FormGroup>
            <Label for="DCR/Non-DCR" className="font-medium">
              DCR/Non-DCR
            </Label>
            <Input
              type="select"
              name="DCR/Non-DCR"
              id="DCR/Non-DCR"
              onChange={(e) => {
                handleCustomerDetailForm({
                  ...customerDetail,
                  custDcrOrNonDcr: sanatizeHtml(e.target.value),
                });
              }}
            >
              <option value="">Select</option>
              <option key={0} value={"DCR"}>
                DCR
              </option>
              <option key={1} value={"Non-DCR"}>
                Non-DCR
              </option>
            </Input>
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label for="Solar panel wattage (Watt)" className="font-medium">
              Solar panel wattage (Watt)
            </Label>
            <Input
              type="text"
              name="Solar panel wattage (Watt)"
              id="Solar panel wattage (Watt)"
              placeholder="Enter Solar panel wattage (Watt)"
              onChange={(e) =>
                handleCustomerDetailForm({
                  ...customerDetail,
                  custPanelWattage: sanatizeHtml(e.target.value),
                })
              }
              required
            />
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <FormGroup>
            <Label
              for="Remote monitoring UserID (if applicable)"
              className="font-medium"
            >
              Remote monitoring UserID (if applicable)
            </Label>
            <Input
              type="text"
              name="Remote monitoring UserID (if applicable)"
              id="Remote monitoring UserID (if applicable)"
              placeholder="Enter Remote monitoring UserID (if applicable)"
              onChange={(e) =>
                handleCustomerDetailForm({
                  ...customerDetail,
                  custRemoteMonitoringUserId: sanatizeHtml(e.target.value),
                })
              }
            />
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label
              for="Remote monitoring password (if applicable)"
              className="font-medium"
            >
              Remote monitoring password (if applicable)
            </Label>
            <Input
              type="text"
              name="Remote monitoring password (if applicable)"
              id="Remote monitoring password (if applicable)"
              placeholder="Enter Remote monitoring password (if applicable)"
              onChange={(e) =>
                handleCustomerDetailForm({
                  ...customerDetail,
                  custRemoteMonitoringPassword: sanatizeHtml(e.target.value),
                })
              }
            />
          </FormGroup>
        </Col>
      </Row>
      <br></br>
    </div>
  );
}
