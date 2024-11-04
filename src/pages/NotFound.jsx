import { Layout } from 'antd'
import { Content } from 'antd/es/layout/layout'
import React from 'react'

const NotFound = () => {
  return (
    <Layout style={{ minHeight: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="site-layout-background" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <img src="./images/logo.png" alt="404" style={{ width: '300px', height: 'auto' }} />
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '0px', marginTop: '30px', padding: '0 20px' }}>404 Not Found</h1>
          <p>Sorry, the page you visited does not exist.</p>
        </div>
      </Content>
    </Layout>
  )
}

export default NotFound