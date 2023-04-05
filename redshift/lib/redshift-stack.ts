import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { aws_redshift as redshift } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';


export class RedshiftStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    
    const PipefySubnetGroups = new redshift.CfnClusterSubnetGroup(this, 'PipefySubnetGroups', {
      description: 'subnets groups for the redshift cluster',
      subnetIds: ['subnet-017464efb386ea393', 'subnet-0cc0fbd3b62a4305a'],
      tags: [{
        key: 'Name',
        value: 'pipefy-subnet-groups',
      }],
    });

    new cdk.CfnOutput(this, 'PipefySubnetGroupsRef', {
      value: PipefySubnetGroups.attrClusterSubnetGroupName,
      description: 'The name of the PipefySubnetGroups',
      exportName: 'PipefySubnetGroups',
    });

    var randomstring = require("randomstring");
    var password = randomstring.generate()
    
    const mapfre_redshift_pipefy = new redshift.CfnCluster(this, 'mapfre_redshift_pipefy', {
      clusterType: 'single-node',
      dbName: 'mapfre_redshift_pipefy',
      masterUsername: 'administrator',
      masterUserPassword: password,
      nodeType: 'dc2.large',
      clusterSubnetGroupName: cdk.Fn.importValue('PipefySubnetGroups'),
    });

    mapfre_redshift_pipefy.addDependency(PipefySubnetGroups);

    const mapfre_redshift_pipefy_analytics = new redshift.CfnCluster(this, 'mapfre_redshift_pipefy_analytics', {
      clusterType: 'single-node',
      dbName: 'mapfre_redshift_pipefy',
      masterUsername: 'administrator',
      masterUserPassword: password,
      nodeType: 'dc2.large',
      clusterSubnetGroupName: cdk.Fn.importValue('PipefySubnetGroups')
    });

    mapfre_redshift_pipefy_analytics.addDependency(PipefySubnetGroups);
  }
}