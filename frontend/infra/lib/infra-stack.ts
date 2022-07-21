import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as acm  from 'aws-cdk-lib/aws-certificatemanager';
import * as cloudfront  from 'aws-cdk-lib/aws-cloudfront';
import * as targets  from 'aws-cdk-lib/aws-route53-targets';
import * as deploy  from 'aws-cdk-lib/aws-s3-deployment';
import * as cdk from '@aws-cdk/core';

interface MultiStackProps extends StackProps {
  environment?: string;
}

export class InfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: MultiStackProps) {
    super(scope, id, props);

    const zone = route53.HostedZone.fromLookup(this, `Z0007667DTIAHFDPI9UR`, {
      domainName: 'appsdirect.click',
    });

    console.log(zone.zoneName);

    const siteBucket = new s3.Bucket(this, "SiteBucket", {
      bucketName: 'appsdirect.click',
      websiteIndexDocument: "index.html",
      publicReadAccess: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    const cert = new acm.DnsValidatedCertificate(this, "SiteCertificate", {
      domainName: '*.appsdirect.click',
      subjectAlternativeNames: ['appsdirect.click'],
      hostedZone: zone,
      region: "us-east-1",
    });

    const siteDistribution = new cloudfront.CloudFrontWebDistribution(this, "SiteDistribution", {
      viewerCertificate: cloudfront.ViewerCertificate.fromAcmCertificate(
          cert,
          {
            aliases: ['appsdirect.click'],
            securityPolicy: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021, // default
            sslMethod: cloudfront.SSLMethod.SNI, // default
          },
      ),
      originConfigs: [{
        customOriginSource: {
          domainName: siteBucket.bucketWebsiteDomainName,
          originProtocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY
        },
        behaviors: [{
          isDefaultBehavior: true
        }]
      }]
    });

    new route53.ARecord(this, "SiteRecord", {
      recordName: 'appsdirect.click',
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(siteDistribution)),
      zone
    });

    new deploy.BucketDeployment(this, "Deployment", {
      sources: [deploy.Source.asset("../build")],
      destinationBucket: siteBucket,
      distribution: siteDistribution,
      distributionPaths: ["/*"]
    });
  }
}
